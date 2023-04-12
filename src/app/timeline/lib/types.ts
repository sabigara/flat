export const tlFilterReply = ["all", "following", "none"] as const;
export type TlFilterReply = (typeof tlFilterReply)[number];
export const tlFilterRepost = ["all", "latest", "none"] as const;
export type TlFilterRepost = (typeof tlFilterRepost)[number];

export type TlFilers = {
  reply: TlFilterReply;
  repost: TlFilterRepost;
};
