import { AppBskyFeedDefs } from "@atproto/api";
import React from "react";

import {
  filterRepliesToNoFollowing,
  filterDuplicates,
} from "@/src/app/post/lib/postFilters";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import {
  Timeline,
  TimelineQueryFn,
} from "@/src/app/timeline/components/Timeline";
import { atp, bsky } from "@/src/lib/atp";

import styles from "./HomeTimelineRoute.module.scss";

export function HomeTimelineRoute() {
  const queryKey = queryKeys.feed.home.$;
  const queryFn: TimelineQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.feed.getTimeline({
      limit: 25,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };

  const postFilter = (posts: AppBskyFeedDefs.FeedViewPost[]) => {
    return filterDuplicates(
      posts.filter((p) => filterRepliesToNoFollowing(p, atp))
    );
  };
  const fetchLatest = React.useCallback(
    async () =>
      postFilter((await bsky.feed.getTimeline({ limit: 1 })).data.feed).at(0),
    []
  );
  return (
    <>
      <Seo title="Flat" />
      <div className={styles.container}>
        <Timeline
          queryKey={queryKey}
          queryFn={queryFn}
          fetchLatestOne={fetchLatest}
          filter={postFilter}
        />
      </div>
    </>
  );
}
