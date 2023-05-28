import React from "react";

import { getBskyApi } from "@/src/app/account/states/atp";
import {
  feedFiltersToFn,
  feedFilterNoop,
} from "@/src/app/feed/lib/feedFilters";
import { FeedQueryFn } from "@/src/app/feed/lib/feedQuery";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { useProfileOutletCtx } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

type Params = {
  withReply: boolean;
};

export function useProfileRouteFeed({ withReply }: Params) {
  const { profile } = useProfileOutletCtx();
  const queryKey = queryKeys.feed.author(profile.handle).$;
  const queryFn: FeedQueryFn<typeof queryKey> = async ({
    queryKey,
    pageParam,
  }) => {
    const resp = await getBskyApi().feed.getAuthorFeed({
      actor: queryKey[1].authorId,
      limit: 30,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };

  const feedFilter = withReply
    ? feedFilterNoop
    : feedFiltersToFn(
        {
          reply: "author",
          repost: "latest",
        },
        {
          authorDid: profile.did,
        }
      );
  const fetchLatest = React.useCallback(
    async () =>
      feedFilter(
        (
          await getBskyApi().feed.getAuthorFeed({
            actor: profile.handle,
            limit: 1,
          })
        ).data.feed
      ).at(0),
    [feedFilter, profile.handle]
  );

  return {
    queryKey,
    queryFn,
    feedFilter,
    fetchLatest,
  };
}
