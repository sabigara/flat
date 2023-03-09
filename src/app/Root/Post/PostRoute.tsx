import { AppBskyFeedGetPostThread } from "@atproto/api";
import { useLoaderData } from "react-router-dom";

import type { PostRouteLoaderResult } from "@/src/app/Root/Post";

import Post from "@/src/components/Post";

export default function PostRoute() {
  const thread = useLoaderData() as PostRouteLoaderResult;
  // TODO: correct?
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;
  return <Post data={thread} />;
}
