import { AtpSessionData } from "@atproto/api";

import { atp, bsky } from "@/src/lib/atp";
import { storageKeys } from "@/src/lib/storage";

export async function getAccount() {
  let session = atp.session;
  if (!session) {
    const sessionStr = localStorage.getItem(storageKeys.session.$);
    if (!sessionStr) return undefined;
    session = JSON.parse(sessionStr) as AtpSessionData;
    await atp.resumeSession(session);
  }
  const resp = await bsky.actor.getProfile({
    actor: session.handle,
  });
  return {
    profile: resp.data,
    session,
  };
}
