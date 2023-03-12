import { LoaderFunction } from "react-router-dom";

import PostRoute from "@/src/app/post/PostRoute/PostRoute";
import { bsky } from "@/src/lib/atp/atp";

export const loader = (async ({ params }) => {
  if (!params.handle || !params.rkey) {
    throw new Error("Invalid params");
  }
  // TODO: can this be cached when transitioned?
  const profileResp = await bsky.actor.getProfile({
    actor: params.handle,
  });
  const threadResp = await bsky.feed.getPostThread({
    uri: `at://${profileResp.data.did}/app.bsky.feed.post/${params.rkey}`,
  });
  return threadResp.data.thread;
}) satisfies LoaderFunction;

export type PostRouteLoaderResult = Awaited<ReturnType<typeof loader>>;

export const element = <PostRoute />;
