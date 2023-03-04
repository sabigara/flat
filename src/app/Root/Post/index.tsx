import Post from "@/src/components/Post";
import { AppBskyFeedGetPostThread } from "@atproto/api";
import { bsky } from "@/src/lib/atp";
import { LoaderFunction, useLoaderData } from "react-router-dom";

export const loader = (async ({ params }) => {
  if (!params.postUri) {
    throw new Error("Invalid params");
  }
  const resp = await bsky.feed.getPostThread({
    uri: atob(params.postUri),
  });
  return resp.data.thread;
}) satisfies LoaderFunction;

export const element = <PostRoute />;

export default function PostRoute() {
  const thread = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  // TODO: correct?
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;
  return <Post data={thread} />;
}
