import React from "react";
import { useTranslation } from "react-i18next";

import { getBskyApi } from "@/src/app/account/states/atp";
import { Feed, FeedQueryFn } from "@/src/app/feed/components/Feed";
import { FeedFilter } from "@/src/app/feed/components/FeedFilter";
import { useFeedFilter } from "@/src/app/feed/hooks/useFeedFilter";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import { userToName } from "@/src/app/user/lib/userToName";
import { useProfileOutletCtx } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

export function ProfileFeedRoute() {
  const { t: usersT } = useTranslation("users");
  const { profile } = useProfileOutletCtx();
  const username = userToName(profile);
  const queryKey = queryKeys.feed.author.$(profile.handle);
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
  const { feedFilter } = useFeedFilter();
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

  return (
    <>
      <Seo
        title={usersT("profile.title", { actor: username })}
        description={profile.description}
      />
      <FeedFilter />
      <Feed
        queryKey={queryKey}
        queryFn={queryFn}
        fetchNewLatest={fetchLatest}
        filter={feedFilter}
      />
    </>
  );
}
