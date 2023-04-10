import { AppBskyFeedDefs, AtpAgent } from "@atproto/api";

export function filterRepliesToNoFollowing(
  post: AppBskyFeedDefs.FeedViewPost,
  atp: AtpAgent
) {
  if (post.reply?.parent.author.viewer) {
    return (
      !!post.reply.parent.author.viewer.following ||
      post.reply.parent.author.did === atp.session?.did
    );
  }
  return true;
}

export function filterDuplicates(posts: AppBskyFeedDefs.FeedViewPost[]) {
  const ret: AppBskyFeedDefs.FeedViewPost[] = [];
  for (const p of posts) {
    if (ret.find((e) => e.post.uri === p.post.uri)) {
      continue;
    }
    ret.push(p);
  }
  return ret;
}
