import { AppBskyEmbedRecord, AppBskyFeedDefs } from "@atproto/api";

import { FeedFilers } from "@/src/app/feed/lib/types";

export type FeedFilterFn = (
  posts: AppBskyFeedDefs.FeedViewPost[]
) => AppBskyFeedDefs.FeedViewPost[];

export function feedFiltersToFn(
  { reply, repost }: FeedFilers,
  myDid?: string
): FeedFilterFn {
  const replyFilter: FeedFilterFn = (() => {
    switch (reply) {
      case "all":
        return feedFilterNoop;
      case "following":
        if (!myDid) {
          throw new Error("`myDid` is required for reply.following filter.");
        }
        return (posts) => excludeRepliesToNoFollowing(posts, myDid);
      case "none":
        return excludeReplies;
    }
  })();
  const repostFilter: FeedFilterFn = (() => {
    switch (repost) {
      case "all":
        return feedFilterNoop;
      case "latest":
        return excludeDuplicates;
      case "none":
        return excludeReposts;
    }
  })();
  return (posts) => replyFilter(repostFilter(defaultFilters(posts)));
}

export const feedFilterNoop: FeedFilterFn = (posts) => posts;

function defaultFilters(posts: AppBskyFeedDefs.FeedViewPost[]) {
  return excludeMuted(posts);
}

function excludeMuted(posts: AppBskyFeedDefs.FeedViewPost[]) {
  return posts.filter((view) => !isReplyToMuted(view) && !isQuoteOfMuted(view));
}

function isReplyToMuted(view: AppBskyFeedDefs.FeedViewPost): boolean {
  return (
    !!view.reply?.parent.author.viewer &&
    !!view.reply.parent.author.viewer.muted
  );
}

function isQuoteOfMuted(view: AppBskyFeedDefs.FeedViewPost): boolean {
  const record = view.post.embed?.record;
  if (!AppBskyEmbedRecord.isViewRecord(record)) {
    return false;
  }
  return !!record.author.viewer && !!record.author.viewer.muted;
}

function excludeRepliesToNoFollowing(
  posts: AppBskyFeedDefs.FeedViewPost[],
  myDid: string
) {
  return posts.filter((view) => {
    // FIXME: check if the root is also a following account.
    if (view.reply?.parent.author.viewer) {
      return (
        !!view.reply.parent.author.viewer.following ||
        view.reply.parent.author.did === myDid
      );
    }
    return true;
  });
}

const excludeReplies: FeedFilterFn = (posts) => {
  return posts.filter((view) => !view.reply);
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
  return posts.filter((view) => !AppBskyFeedDefs.isReasonRepost(view.reason));
};
