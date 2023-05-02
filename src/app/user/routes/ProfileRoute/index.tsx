import { RichText } from "@atproto/api";
import { LoaderFunction } from "react-router-dom";

import { getAtpAgent, getBskyApi } from "@/src/app/account/states/atp";
import { ProfileRoute } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

// TODO: handle not found
export const loader = (async ({ params }) => {
  if (!params.handle) {
    throw new Error("Invalid params");
  }
  const resp = await getBskyApi().actor.getProfile({
    actor: params.handle,
  });
  const profile = resp.data;
  const richText = new RichText({ text: profile.description ?? "" });
  await richText.detectFacets(getAtpAgent());
  return { profile: resp.data, richText };
}) satisfies LoaderFunction;

export type ProfileRouteLoaderResult = Awaited<ReturnType<typeof loader>>;

export const element = <ProfileRoute />;
