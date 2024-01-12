import React from "react";

import { getBskyApi } from "@/src/app/account/states/atp";
import { FeedQueryFn } from "@/src/app/feed/lib/feedQuery";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { useProfileOutletCtx } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

export function useProfileRouteMediaFeed() {
  const { profile } = useProfileOutletCtx();
  const authorId = profile.handle;
  const queryKey = queryKeys.feed.author(authorId).media;
  const filter = "posts_with_media" as const;

  const queryFn: FeedQueryFn<typeof queryKey> = async ({
    queryKey,
    pageParam,
  }) => {
    const actor = queryKey[1].authorId;
    const resp = await getBskyApi().feed.getAuthorFeed({
      actor,
      filter,
      limit: 24, // 3or4列なので3,4の公倍数
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };

  const fetchLatest = React.useCallback(async () => {
    return (
      await getBskyApi().feed.getAuthorFeed({
        actor: authorId,
        filter,
        limit: 1,
      })
    ).data.feed.at(0);
  }, [authorId]);

  return {
    queryKey,
    queryFn,
    fetchLatest,
  };
}
