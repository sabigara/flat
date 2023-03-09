import { LoaderFunction } from "react-router-dom";

import PostRoute from "@/src/app/Root/Post/PostRoute";
import { bsky } from "@/src/lib/atp/atp";

export const loader = (async ({ params }) => {
  if (!params.postUri) {
    throw new Error("Invalid params");
  }
  const resp = await bsky.feed.getPostThread({
    uri: atob(params.postUri),
  });
  return resp.data.thread;
}) satisfies LoaderFunction;

export type PostRouteLoaderResult = Awaited<ReturnType<typeof loader>>;

export const element = <PostRoute />;
