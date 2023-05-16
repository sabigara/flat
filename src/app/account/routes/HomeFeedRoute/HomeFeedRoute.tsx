import { useAtomValue } from "jotai";
import React from "react";

import { getBskyApi } from "@/src/app/account/states/atp";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Feed, FeedQueryFn } from "@/src/app/feed/components/Feed";
import { FeedFilter } from "@/src/app/feed/components/FeedFilter";
import { useFeedFilter } from "@/src/app/feed/hooks/useFeedFilter";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";

import styles from "./HomeFeedRoute.module.scss";

export function HomeFeedRoute() {
  const queryKey = queryKeys.feed.home.$;
  const queryFn: FeedQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await getBskyApi().feed.getTimeline({
      limit: 30,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const { feedFilter } = useFeedFilter();
  const { inFeedThreadMode } = useAtomValue(settingsAtom);

  const fetchLatest = React.useCallback(
    async () =>
      feedFilter(
        (await getBskyApi().feed.getTimeline({ limit: 5 })).data.feed
      ).at(0),
    [feedFilter]
  );
  return (
    <>
      <Seo title="Flat" />
      <div className={styles.container}>
        <FeedFilter />
        <Feed
          queryKey={queryKey}
          queryFn={queryFn}
          fetchNewLatest={fetchLatest}
          filter={feedFilter}
          aggregateThreads={inFeedThreadMode === "aggregate"}
        />
      </div>
    </>
  );
}
