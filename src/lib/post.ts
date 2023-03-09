import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { AtUri } from "@atproto/uri";

export function feedItemToUniqueKey(
  item: AppBskyFeedFeedViewPost.Main
): string {
  return `${item.post.cid}:${item.reason?.$type}:${
    (item.reason?.by as any)?.did
  }`;
}

export const buildPostUrl = (params: { handle: string; uri: string }) =>
  `/${params.handle}/posts/${new AtUri(params.uri).rkey}`;
