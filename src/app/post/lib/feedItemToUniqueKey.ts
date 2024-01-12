import { AppBskyFeedDefs } from "@atproto/api";

export function feedItemToUniqueKey(
  item: AppBskyFeedDefs.FeedViewPost,
): string {
  return `${item.post.cid}:${item.reason?.$type}:${(item.reason?.by as any)
    ?.did}`;
}
