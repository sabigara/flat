import { AtpAgent, AtpPersistSessionHandler } from "@atproto/api";
import produce from "immer";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Sessions } from "@/src/app/account/lib/types";
import { storageKeys } from "@/src/lib/storage";

const initialSessions: Sessions = {
  accounts: {},
  currentDid: null,
} as const;

const SESSION_KEY = storageKeys.session.$;
const storedSessions = localStorage.getItem(SESSION_KEY);
export const sessionsAtom = atomWithStorage<Sessions>(
  SESSION_KEY,
  storedSessions ? JSON.parse(storedSessions) : initialSessions
);

function persistSessionFactory(
  currSessions: Sessions,
  service: string
): AtpPersistSessionHandler {
  return (e, session) => {
    let sessionsToStore: Sessions;
    switch (e) {
      case "create":
      case "update": {
        if (!session) return; // TODO: why?
        sessionsToStore = produce(currSessions, (draft) => {
          draft.accounts[session.did] = {
            session: session,
            service,
          };
          draft.currentDid = session.did;
        });
        break;
      }
      case "expired":
      case "create-failed": {
        if (!session) return; // TODO: why?
        sessionsToStore = produce(currSessions, (draft) => {
          delete draft.accounts[session.did];
          draft.currentDid = null;
        });
        break;
      }
    }
    localStorage.setItem(
      storageKeys.session.$,
      JSON.stringify(sessionsToStore)
    );
  };
}

const atpAgentAtom = atom<AtpAgent>((get) => {
  const currSessions = get(sessionsAtom);
  const { currentDid: current, accounts } = currSessions;
  const currAccount = current ? accounts[current] : undefined;
  const service = currAccount?.service || "https://bsky.social";
  return new AtpAgent({
    service,
    persistSession: persistSessionFactory(currSessions, service),
  });
});

export function useAtpAgent() {
  return useAtomValue(atpAgentAtom);
}

export function useBskyApi() {
  const atp = useAtpAgent();
  return atp?.api.app.bsky;
}

export function getAtpAgent() {
  return getDefaultStore().get(atpAgentAtom);
}

export function getBskyApi() {
  return getAtpAgent().api.app.bsky;
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
    persistSession: persistSessionFactory(
      getDefaultStore().get(sessionsAtom),
      service
    ),
  });
  const resp = await atp.login({
    identifier,
    password,
  });
  if (!resp.success) {
    throw new Error("Login failed.");
  }
  getDefaultStore().set(
    sessionsAtom,
    produce(getDefaultStore().get(sessionsAtom), (draft) => {
      draft.accounts[resp.data.did] = {
        service,
        session: resp.data,
      };
      draft.currentDid = resp.data.did;
    })
  );
}
