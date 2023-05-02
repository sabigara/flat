import { resumeSession, getBskyApi } from "@/src/app/account/states/atp";

export async function getAccount() {
  const session = await resumeSession();
  if (!session) return undefined;
  const resp = await getBskyApi().actor.getProfile({
    actor: session.handle,
  });
  return {
    profile: resp.data,
    session,
  };
}
