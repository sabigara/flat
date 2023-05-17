import { AppBskyFeedDefs } from "@atproto/api";

import { FeedFilterFn } from "@/src/app/feed/lib/feedFilters";
import { sortFeedViewPosts } from "@/src/app/post/lib/sortFeedViewPosts";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;

export function aggregateInFeedThreads(
  posts: FeedViewPost[],
  filter: FeedFilterFn
): (FeedViewPost | FeedViewPost[])[] {
  const threads = new Map<string, FeedViewPost[]>();
  const ret: (FeedViewPost | FeedViewPost[])[] = [];
  for (const p of posts) {
    if (p.reply) {
      const rootUri = p.reply.root.uri;
      const curr = threads.get(rootUri);
      threads.set(rootUri, [
        ...filter(curr ? curr : [{ post: p.reply.root }]), // Prepend root post
        p,
      ]);
    } else {
      const thread = threads.get(p.post.uri);
      if (thread) {
        if (thread.at(0)?.post.uri === p.post.uri) continue;
        threads.set(p.post.uri, [p, ...thread]);
      } else {
        ret.push(p);
      }
    }
  }
  for (const [, replies] of threads.entries()) {
    ret.push(replies.sort(makeSort(false)));
    console.dir(replies);
  }
  return [...ret.sort(makeSort(true))];
}

const makeSort = (reverse = true) => {
  return (
    a: FeedViewPost | FeedViewPost[],
    b: FeedViewPost | FeedViewPost[]
  ) => {
    const itemA = Array.isArray(a) ? a.at(-1) : a;
    const itemB = Array.isArray(b) ? b.at(-1) : b;
    if (!itemA || !itemB) return 0;
    return sortFeedViewPosts(itemA, itemB, reverse);
  };
};
