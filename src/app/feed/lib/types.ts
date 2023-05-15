export const feedFilterReply = ["all", "following", "author", "none"] as const;
export type FeedFilterReply = (typeof feedFilterReply)[number];
export const feedFilterRepost = ["all", "latest", "none"] as const;
export type FeedFilterRepost = (typeof feedFilterRepost)[number];

export type FeedFilers = {
  reply: FeedFilterReply;
  repost: FeedFilterRepost;
};
