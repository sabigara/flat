import React from "react";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import {
  Timeline,
  TimelineQueryFn,
} from "@/src/app/timeline/components/Timeline";
import { TimelineFilter } from "@/src/app/timeline/components/TimelineFilter";
import { useTimelineFilter } from "@/src/app/timeline/hooks/useTimelineFilter";

import styles from "./HomeTimelineRoute.module.scss";

export function HomeTimelineRoute() {
  const queryKey = queryKeys.feed.home.$;
  const queryFn: TimelineQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await getBskyApi().feed.getTimeline({
      limit: 30,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const { timelineFilter } = useTimelineFilter();

  const fetchLatest = React.useCallback(
    async () =>
      timelineFilter(
        (await getBskyApi().feed.getTimeline({ limit: 5 })).data.feed
      ).at(0),
    [timelineFilter]
  );
  return (
    <>
      <Seo title="Flat" />
      <div className={styles.container}>
        <TimelineFilter />
        <Timeline
          queryKey={queryKey}
          queryFn={queryFn}
          fetchNewLatest={fetchLatest}
          filter={timelineFilter}
        />
      </div>
    </>
  );
}
