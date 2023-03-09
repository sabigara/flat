import { AppBskyFeedFeedViewPost } from "@atproto/api";

export function feedItemToUniqueKey(
  item: AppBskyFeedFeedViewPost.Main
): string {
  return `${item.post.cid}:${item.reason?.$type}:${
    (item.reason?.by as any)?.did
  }`;
}
