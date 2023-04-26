import { getDefaultStore } from "jotai";

import { getAtpAgent, sessionsAtom } from "@/src/app/account/states/atp";

export async function getAccount() {
  const atp = getAtpAgent();
  let session = atp.session;
  if (!session) {
    const { accounts, currentDid } = getDefaultStore().get(sessionsAtom);
    if (!currentDid) return;
    const currSession = accounts[currentDid].session;
    if (!currSession) return;
    session = {
      accessJwt: currSession.accessJwt,
      did: currSession.did,
      handle: currSession.handle,
      refreshJwt: currSession.refreshJwt,
      email: currSession.email,
    };
    await atp.resumeSession(session);
  }
  const resp = await atp.api.app.bsky.actor.getProfile({
    actor: session.handle,
  });
  return {
    profile: resp.data,
    session,
  };
}
