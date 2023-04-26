import { AppBskyFeedDefs } from "@atproto/api";

import { TlFilers } from "@/src/app/timeline/lib/types";

export type TlFilterFn = (
  posts: AppBskyFeedDefs.FeedViewPost[]
) => AppBskyFeedDefs.FeedViewPost[];

export function tlFiltersToFn(
  { reply, repost }: TlFilers,
  myDid: string
): TlFilterFn {
  const replyFilter: TlFilterFn = (() => {
    switch (reply) {
      case "all":
        return tlFilterNoop;
      case "following":
        return (posts) => excludeRepliesToNoFollowing(posts, myDid);
      case "none":
        return excludeReplies;
    }
  })();
  const repostFilter: TlFilterFn = (() => {
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

export const tlFilterNoop: TlFilterFn = (posts) => posts;

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

const excludeReplies: TlFilterFn = (posts) => {
  return posts.filter((post) => !post.reply);
};

const excludeDuplicates: TlFilterFn = (posts) => {
  const ret: AppBskyFeedDefs.FeedViewPost[] = [];
  for (const p of posts) {
    if (ret.find((e) => e.post.uri === p.post.uri)) {
      continue;
    }
    ret.push(p);
  }
  return ret;
};

const excludeReposts: TlFilterFn = (posts) => {
  return posts.filter((p) => !AppBskyFeedDefs.isReasonRepost(p.reason));
};
