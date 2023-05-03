import { AppBskyFeedDefs } from "@atproto/api";

import { FeedFilers } from "@/src/app/feed/lib/types";

export type FeedFilterFn = (
  posts: AppBskyFeedDefs.FeedViewPost[]
) => AppBskyFeedDefs.FeedViewPost[];

export function feedFiltersToFn(
  { reply, repost }: FeedFilers,
  myDid: string
): FeedFilterFn {
  const replyFilter: FeedFilterFn = (() => {
    switch (reply) {
      case "all":
        return tlFilterNoop;
      case "following":
        return (posts) => excludeRepliesToNoFollowing(posts, myDid);
      case "none":
        return excludeReplies;
    }
  })();
  const repostFilter: FeedFilterFn = (() => {
    switch (repost) {
      case "all":
        return tlFilterNoop;
      case "latest":
        return excludeDuplicates;
      case "none":
        return excludeReposts;
    }
  })();
  return (posts) => replyFilter(repostFilter(posts));
}

export const tlFilterNoop: FeedFilterFn = (posts) => posts;

function excludeRepliesToNoFollowing(
  posts: AppBskyFeedDefs.FeedViewPost[],
  myDid: string
) {
  return posts.filter((post) => {
    // FIXME: check if the root is also a following account.
    if (post.reply?.parent.author.viewer) {
      return (
        (!!post.reply.parent.author.viewer.following &&
          !post.reply.parent.author.viewer.muted) ||
        post.reply.parent.author.did === myDid
      );
    }
    return true;
  });
}

const excludeReplies: FeedFilterFn = (posts) => {
  return posts.filter((post) => !post.reply);
};

const excludeDuplicates: FeedFilterFn = (posts) => {
  const ret: AppBskyFeedDefs.FeedViewPost[] = [];
  for (const p of posts) {
    if (ret.find((e) => e.post.uri === p.post.uri)) {
      continue;
    }
    ret.push(p);
  }
  return ret;
};

const excludeReposts: FeedFilterFn = (posts) => {
  return posts.filter((p) => !AppBskyFeedDefs.isReasonRepost(p.reason));
};
