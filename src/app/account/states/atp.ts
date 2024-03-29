import { AtpAgent, AtpPersistSessionHandler } from "@atproto/api";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { withImmer } from "jotai-immer";

import { BSKY_SOCIAL } from "@/src/app/account/lib/constants";
import { Account, AccountKeys, Sessions } from "@/src/app/account/lib/types";
import { storageKeys } from "@/src/lib/storage";
import { PartialBy } from "@/src/lib/typing";

const initialSessions: Sessions = {
  accounts: {},
  current: null,
} as const;

const SESSION_KEY = storageKeys.session.$;
const storedSessions = localStorage.getItem(SESSION_KEY);

export const sessionsAtom = atomWithStorage<Sessions>(
  SESSION_KEY,
  storedSessions ? JSON.parse(storedSessions) : initialSessions,
);

export function updateSessionsByMerge({
  accounts = {},
  current = null,
}: Partial<Sessions>) {
  getDefaultStore().set(sessionsAtom, (state) => {
    const newCurrent = state.current
      ? { ...state.current, ...current }
      : current;
    const newAccounts = { ...state.accounts, ...accounts };
    return {
      accounts: newAccounts,
      current: newCurrent,
    };
  });
}

const resolvedAccountWithSessionAtom = atom<Account | undefined>((get) => {
  const { accounts, current } = get(sessionsAtom);
  if (!current) return undefined;

  const accountValues = Object.values(accounts);
  const foundAccount = accountValues.find(
    (account) =>
      account.did === current.did && account.service === current.service,
  );
  if (foundAccount && foundAccount.session) return foundAccount;

  return accountValues.find((account) => !!account.session);
});

function makePersistSession(service: string): AtpPersistSessionHandler {
  let did = "";
  let key = "";
  return (e, session) => {
    switch (e) {
      case "create":
      case "update": {
        if (!session) return;
        did = session.did;
        key = makeAtpAgentCacheKey({ service, did: session.did });
        // FIXME: using immer causes weird bug related to `Object.freeze()` or something?
        // https://github.com/sabigara/flat/issues/33
        updateSessionsByMerge({
          accounts: {
            [key]: {
              session,
              service,
              did: session.did,
            },
          },
        });
        break;
      }
      case "expired":
      case "create-failed": {
        if (!did) return;
        getDefaultStore().set(withImmer(sessionsAtom), (draft) => {
          const account = draft.accounts[key];
          if (account) void (account.session = null);
        });
        break;
      }
    }
  };
}

function makeAtpAgent(service: string) {
  return new AtpAgent({
    service,
    persistSession: makePersistSession(service),
  });
}

// TODO: should be an atom?
const atpAgentCache = new Map<string, AtpAgent>();
atpAgentCache.set("anonymous", makeAtpAgent(BSKY_SOCIAL));

export function makeAtpAgentCacheKey({
  service,
  did,
}: PartialBy<AccountKeys, "did">) {
  return `${service.replace(/\/$/, "")}+${did ? did : "anonymous"}`;
}

const atpAgentAtom = atom<AtpAgent>((get) => {
  const account = get(resolvedAccountWithSessionAtom);
  const service = account?.service || BSKY_SOCIAL;
  const cacheKey = makeAtpAgentCacheKey({ service, did: account?.did });
  const cached = atpAgentCache.get(cacheKey);
  if (cached) return cached;

  const newAtpAgent = makeAtpAgent(service);
  atpAgentCache.set(cacheKey, newAtpAgent);

  return newAtpAgent;
});

export function useAtpAgent() {
  return useAtomValue(atpAgentAtom);
}

export function useBskyApi() {
  const atp = useAtpAgent();
  return atp.api.app.bsky;
}

export function getAtpAgent() {
  return getDefaultStore().get(atpAgentAtom);
}

export function getAtpAgentFromCache(keys: AccountKeys) {
  return atpAgentCache.get(makeAtpAgentCacheKey(keys));
}

export function getBskyApi() {
  return getAtpAgent().api.app.bsky;
}

export function getSessions() {
  return getDefaultStore().get(sessionsAtom);
}

export function getResolvedAccountWithSession() {
  return getDefaultStore().get(resolvedAccountWithSessionAtom);
}

export function useResolvedAccountWithSession() {
  return useAtomValue(resolvedAccountWithSessionAtom);
}

type LoginParams = {
  service: string;
  identifier: string;
  password: string;
};

export async function loginWithPersist({
  service,
  identifier,
  password,
}: LoginParams) {
  const atp = new AtpAgent({
    service,
    persistSession: makePersistSession(service),
  });

  const resp = await atp.login({
    identifier,
    password,
  });
  if (!resp.success) {
    throw new Error("Login failed.");
  }
  atpAgentCache.set(makeAtpAgentCacheKey({ service, did: resp.data.did }), atp);
  getDefaultStore().set(withImmer(sessionsAtom), (draft) => {
    draft.current = { service, did: resp.data.did };
  });
  return resp.data;
}

export async function resumeSession() {
  const atp = getAtpAgent();
  let session = atp.session;
  if (!atp.hasSession || !session) {
    const account = getResolvedAccountWithSession();
    if (!account || !account?.session) return;
    session = account.session;
    try {
      await atp.resumeSession({ ...session });
    } catch (e) {
      console.error(e);
      getDefaultStore().set(withImmer(sessionsAtom), (draft) => {
        const key = makeAtpAgentCacheKey({
          service: atp.service.toString(),
          did: session?.did,
        });
        if (draft.accounts[key]) {
          draft.accounts[key].session = null;
        }
      });
      return;
    }
  }
  return session;
}

export function getFirstAccountWithSession() {
  const { accounts } = getSessions();
  return (
    Object.values(accounts)
      .filter((account) => !!account.session)
      .at(0) ?? null
  );
}

export function switchAccount(service: string, did: string) {
  getDefaultStore().set(withImmer(sessionsAtom), (draft) => {
    draft.current = {
      service,
      did,
    };
  });
}

export function signOut({ service, did }: AccountKeys) {
  const keyToDelete = makeAtpAgentCacheKey({ service, did });
  getDefaultStore().set(withImmer(sessionsAtom), (draft) => {
    if (draft.current && draft.current?.did === did) {
      draft.current =
        Object.values(draft.accounts)
          .filter(
            (account) =>
              account.did !== did && account.service !== draft.current?.service,
          )
          .at(0) ?? null;
    }
    delete draft.accounts[keyToDelete];
  });
  atpAgentCache.delete(keyToDelete);
}
