import { LoaderFunction } from "react-router-dom";

import { ProfileRoute } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";
import { bsky } from "@/src/lib/atp";

export const loader = (async ({ params }) => {
  if (!params.handle) {
    throw new Error("Invalid params");
  }
  const resp = await bsky.actor.getProfile({
    actor: params.handle,
  });
  return resp.data;
}) satisfies LoaderFunction;

export type ProfileRouteLoaderResult = Awaited<ReturnType<typeof loader>>;

export const element = <ProfileRoute />;
