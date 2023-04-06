import { AppBskyFeedDefs } from "@atproto/api";
import { Draft } from "immer";

export type MutatePostCache = (params: {
  cid: string;
  fn: (draft: Draft<AppBskyFeedDefs.PostView>) => void;
}) => void;
