import { AppBskyFeedDefs } from "@atproto/api";

import { sortFeedViewPosts } from "@/src/app/post/lib/sortFeedViewPosts";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;

export function aggregateInFeedThreads(
  posts: FeedViewPost[]
): (FeedViewPost | FeedViewPost[])[] {
  const pendingReplies = new Map<string, FeedViewPost[]>();
  const ret: (FeedViewPost | FeedViewPost[])[] = [];
  for (const p of posts) {
    if (p.reply) {
      pendingReplies.set(p.reply.root.uri, [
        p,
        ...(pendingReplies.get(p.reply.root.uri) ?? []),
      ]);
      continue;
    }
    const replies = pendingReplies.get(p.post.uri);

    if (replies) {
      ret.push([p, ...replies]);
      pendingReplies.delete(p.post.uri);
    } else {
      ret.push(p);
    }
  }
  for (const [, replies] of pendingReplies.entries()) {
    const root = replies[0].reply?.root;
    if (!replies || !root) continue;
    ret.push(...replies);
  }

  return [...ret.sort(sort)];
}

const sort = (
  a: FeedViewPost | FeedViewPost[],
  b: FeedViewPost | FeedViewPost[]
) => {
  const itemA = Array.isArray(a) ? a.at(-1) : a;
  const itemB = Array.isArray(b) ? b.at(-1) : b;
  if (!itemA || !itemB) return 0;
  return sortFeedViewPosts(itemA, itemB);
};
