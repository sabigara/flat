import { AppBskyFeedDefs } from "@atproto/api";

import { isNonNullish } from "@/src/app/post/lib/types";

export function findPostFromThread(
  thread: AppBskyFeedDefs.ThreadViewPost,
  uri: string
): AppBskyFeedDefs.PostView | undefined {
  if (thread.post.uri === uri) return thread.post;
  if (AppBskyFeedDefs.isThreadViewPost(thread.parent)) {
    const resp = findPostFromThread(thread.parent, uri);
    if (resp) return resp;
  }
  return (
    thread.replies?.map((thread) =>
      AppBskyFeedDefs.isThreadViewPost(thread)
        ? findPostFromThread(thread, uri)
        : undefined
    ) ?? []
  )
    .filter(isNonNullish)
    .at(0);
}
