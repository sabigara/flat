import { AtpAgent, AtpPersistSessionHandler } from "@atproto/api";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { withImmer } from "jotai-immer";

import { Account, AccountKeys, Sessions } from "@/src/app/account/lib/types";
import { storageKeys } from "@/src/lib/storage";
import { PartialBy } from "@/src/lib/typing";

const initialSessions: Sessions = {
  accounts: {},
  current: null,
} as const;

const SESSION_KEY = storageKeys.session.$;
const storedSessions = localStorage.getItem(SESSION_KEY);

export const sessionsAtom = withImmer(
  atomWithStorage<Sessions>(
    SESSION_KEY,
    storedSessions ? JSON.parse(storedSessions) : initialSessions
  )
);

const resolvedAccountWithSessionAtom = atom<Account | undefined>((get) => {
  const { accounts, current } = get(sessionsAtom);
  if (!current) return undefined;

  const accountValues = Object.values(accounts);
  const foundAccount = accountValues.find(
    (account) =>
      account.did === current.did && account.service === current.service
  );
  if (foundAccount && foundAccount.session) return foundAccount;

  return accountValues.find((account) => !!account.session);
});

function persistSessionFactory(service: string): AtpPersistSessionHandler {
  return (e, session) => {
    switch (e) {
      case "create":
      case "update": {
        if (!session) return; // TODO: why?
        getDefaultStore().set(sessionsAtom, (draft) => {
          draft.accounts[makeAtpAgentCacheKey({ service, did: session.did })] =
            {
              session: session,
              service,
              did: session.did,
            };
        });
        break;
      }
      case "expired":
      case "create-failed": {
        if (!session) return; // TODO: why?
        getDefaultStore().set(sessionsAtom, (draft) => {
          delete draft.accounts[
            makeAtpAgentCacheKey({ service, did: session.did })
          ];
        });
        break;
      }
    }
  };
}

function makeAtpAgent(service: string) {
  return new AtpAgent({
    service,
    persistSession: persistSessionFactory(service),
  });
}

const atpAgentCache = new Map<string, AtpAgent>();
atpAgentCache.set("anonymous", makeAtpAgent("https://bsky.social"));

function makeAtpAgentCacheKey({ service, did }: PartialBy<AccountKeys, "did">) {
  return `${service.replace(/\/$/, "")}:${did ? did : "anonymous"}`;
}

const atpAgentAtom = atom<AtpAgent>((get) => {
  const account = get(resolvedAccountWithSessionAtom);
  const service = account?.service || "https://bsky.social";
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
    persistSession: persistSessionFactory(service),
  });

  const resp = await atp.login({
    identifier,
    password,
  });
  if (!resp.success) {
    throw new Error("Login failed.");
  }
  atpAgentCache.set(makeAtpAgentCacheKey({ service, did: resp.data.did }), atp);
  getDefaultStore().set(sessionsAtom, (draft) => {
    draft.current = { service, did: resp.data.did };
  });
}

export async function resumeSession() {
  const atp = getAtpAgent();
  let session = atp.session;
  if (!atp.hasSession || !session) {
    const account = getResolvedAccountWithSession();
    if (!account || !account?.session) return;
    session = {
      accessJwt: account.session.accessJwt,
      did: account.session.did,
      handle: account.session.handle,
      refreshJwt: account.session.refreshJwt,
      email: account.session.email,
    };
    try {
      await atp.resumeSession(session);
    } catch (e) {
      console.error(e);
      getDefaultStore().set(sessionsAtom, (draft) => {
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
  getDefaultStore().set(sessionsAtom, (draft) => {
    draft.current = {
      service,
      did,
    };
  });
}

export function signOut({ service, did }: AccountKeys) {
  const keyToDelete = makeAtpAgentCacheKey({ service, did });
  getDefaultStore().set(sessionsAtom, (draft) => {
    if (draft.current && draft.current?.did === did) {
      draft.current =
        Object.values(draft.accounts)
          .filter(
            (account) =>
              account.did !== did && account.service !== draft.current?.service
          )
          .at(0) ?? null;
    }
    delete draft.accounts[keyToDelete];
  });
  atpAgentCache.delete(keyToDelete);
}
