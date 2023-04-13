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

export function isNonNullish<T>(
  something: T
): something is Exclude<T, undefined | null> {
  return something != null;
}
