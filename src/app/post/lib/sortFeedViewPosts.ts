import { AppBskyFeedDefs } from "@atproto/api";

export function sortFeedViewPosts(
  a: AppBskyFeedDefs.FeedViewPost,
  b: AppBskyFeedDefs.FeedViewPost,
  reverse = true
) {
  const indexedAtA = AppBskyFeedDefs.isReasonRepost(a.reason)
    ? a.reason.indexedAt
    : a.post.indexedAt;
  const indexedAtB = AppBskyFeedDefs.isReasonRepost(b.reason)
    ? b.reason.indexedAt
    : b.post.indexedAt;
  const timeA = new Date(indexedAtA).getTime();
  const timeB = new Date(indexedAtB).getTime();
  return reverse ? timeB - timeA : timeA - timeB;
}
