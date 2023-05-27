import { QueryFunction, QueryKey } from "@tanstack/react-query";

import type { AppBskyFeedDefs } from "@atproto/api";

export type FeedQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string;
    feed: AppBskyFeedDefs.FeedViewPost[];
  },
  K
>;
