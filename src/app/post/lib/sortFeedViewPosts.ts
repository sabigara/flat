import { AppBskyFeedDefs } from "@atproto/api";

export function sortFeedViewPosts(
  a: AppBskyFeedDefs.FeedViewPost,
  b: AppBskyFeedDefs.FeedViewPost
) {
  const indexedAtA = AppBskyFeedDefs.isReasonRepost(a.reason)
    ? a.reason.indexedAt
    : a.post.indexedAt;
  const indexedAtB = AppBskyFeedDefs.isReasonRepost(b.reason)
    ? b.reason.indexedAt
    : b.post.indexedAt;
  return new Date(indexedAtB).getTime() - new Date(indexedAtA).getTime();
}
