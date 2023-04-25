import { AppBskyFeedDefs } from "@atproto/api";
import { Draft } from "immer";

export type MutatePostCache = (params: {
  uri: string;
  fn: (draft: Draft<AppBskyFeedDefs.PostView>) => void;
}) => void;

export type RevalidateOnPost = ({
  replyTarget,
}: {
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
}) => void;

export const postImageLayouts = ["stack", "compact"] as const;
export type PostImageLayout = (typeof postImageLayouts)[number];
