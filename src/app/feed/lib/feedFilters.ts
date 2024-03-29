import {
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyFeedDefs,
} from "@atproto/api";

import { FeedFilers } from "@/src/app/feed/lib/types";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
const isPostView = AppBskyFeedDefs.isPostView;

export type FeedFilterFn = (posts: FeedViewPost[]) => FeedViewPost[];

type Options = {
  myDid?: string;
  authorDid?: string;
};

export function feedFiltersToFn(
  { reply, repost }: FeedFilers,
  { authorDid, myDid }: Options,
): FeedFilterFn {
  const replyFilter: FeedFilterFn = (() => {
    switch (reply) {
      case "all":
        return feedFilterNoop;
      case "following":
        if (!myDid) {
          throw new Error("`myDid` is required for reply.following filter.");
        }
        return (posts) => excludeRepliesToNonFollowing(posts, myDid);
      case "author":
        if (!authorDid) {
          throw new Error("`authorDid` is required for reply.myself filter.");
        }
        return (posts) => excludeRepliesToOthers(posts, authorDid);
      case "none":
        return excludeReplies;
    }
  })();
  const repostFilter: FeedFilterFn = (() => {
    switch (repost) {
      case "all":
        return feedFilterNoop;
      case "latest":
        return deduplicateByPostUri;
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
    (isPostView(view.reply?.parent) &&
      !!view.reply?.parent.author.viewer &&
      !!view.reply.parent.author.viewer.muted) ||
    (isPostView(view.reply?.root) &&
      !!view.reply?.root.author.viewer &&
      !!view.reply.root.author.viewer?.muted)
  );
}

function isQuoteOfMuted(view: AppBskyFeedDefs.FeedViewPost): boolean {
  const embed = view.post.embed;
  const record = (() => {
    if (
      AppBskyEmbedRecord.isView(embed) &&
      AppBskyEmbedRecord.isViewRecord(embed.record)
    ) {
      return embed.record;
    }
    if (
      AppBskyEmbedRecordWithMedia.isView(embed) &&
      AppBskyEmbedRecord.isViewRecord(embed.record.record)
    ) {
      return embed.record.record;
    }
  })();
  if (!record) return false;
  return !!record.author.viewer && !!record.author.viewer?.muted;
}

function excludeRepliesToNonFollowing(
  posts: AppBskyFeedDefs.FeedViewPost[],
  myDid: string,
) {
  return posts.filter((view) => {
    // FIXME: check if the root is also a following account.
    if (
      view.reply &&
      isPostView(view.reply.parent) &&
      view.reply.parent.author.viewer
    ) {
      return (
        !!view.reply.parent.author.viewer.following ||
        view.reply.parent.author.did === myDid
      );
    }
    return true;
  });
}

function excludeRepliesToOthers(
  posts: AppBskyFeedDefs.FeedViewPost[],
  authorDid: string,
) {
  return posts.filter((view) => {
    if (!view.reply) return true;
    return (
      isPostView(view.reply.parent) &&
      view.reply.parent.author.did === authorDid &&
      isPostView(view.reply.root) &&
      view.reply.root.author.did === authorDid
    );
  });
}

const excludeReplies: FeedFilterFn = (posts) => {
  return posts.filter((view) => !view.reply);
};

const deduplicateByPostUri: FeedFilterFn = (posts) => {
  const ret: FeedViewPost[] = [];
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
