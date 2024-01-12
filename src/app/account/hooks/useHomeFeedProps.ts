import { AppBskyFeedGetFeed } from "@atproto/api";
import React from "react";

import { getBskyApi } from "@/src/app/account/states/atp";
import { useFeedFilter } from "@/src/app/feed/hooks/useFeedFilter";
import { FeedQueryFn } from "@/src/app/feed/lib/feedQuery";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { PartialBy } from "@/src/lib/typing";

type Params = {
  feed?: string;
};

export function useHomeFeedProps({ feed }: Params) {
  const queryKey = feed
    ? queryKeys.feed.custom(feed).$
    : queryKeys.feed.timeline.$;
  const queryFn: FeedQueryFn<typeof queryKey> = async ({
    pageParam,
    queryKey,
  }) => {
    const [, maybeParams] = queryKey;
    const limit = 30;
    const rest = pageParam ? { cursor: pageParam.cursor } : {};
    const resp = await fetchFeed({ feed: maybeParams?.feed, limit, ...rest });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const { feedFilter } = useFeedFilter();

  const fetchLatest = React.useCallback(async () => {
    return feedFilter(
      (await fetchFeed({ feed: queryKey[1]?.feed, limit: 5 })).data.feed,
    ).at(0);
  }, [feedFilter, queryKey]);

  return { queryKey, queryFn, fetchLatest, feedFilter };
}

const fetchFeed = ({
  cursor,
  feed,
  limit,
}: PartialBy<AppBskyFeedGetFeed.QueryParams, "feed">) => {
  return feed
    ? getBskyApi().feed.getFeed({
        limit,
        feed,
        cursor,
      })
    : getBskyApi().feed.getTimeline({
        limit,
        cursor,
      });
};
