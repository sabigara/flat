import { RichText } from "@atproto/api";
import { LoaderFunction } from "react-router-dom";

import { ProfileRoute } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";
import { atp, bsky } from "@/src/lib/atp";

// TODO: handle not found
export const loader = (async ({ params }) => {
  if (!params.handle) {
    throw new Error("Invalid params");
  }
  const resp = await bsky.actor.getProfile({
    actor: params.handle,
  });
  const profile = resp.data;
  const richText = new RichText({ text: profile.description ?? "" });
  await richText.detectFacets(atp);
  return { profile: resp.data, richText };
}) satisfies LoaderFunction;

export type ProfileRouteLoaderResult = Awaited<ReturnType<typeof loader>>;

export const element = <ProfileRoute />;
