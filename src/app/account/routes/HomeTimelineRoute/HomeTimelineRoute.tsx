import { AppBskyFeedDefs } from "@atproto/api";
import React from "react";

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
    return posts.filter((p) => {
      if (p.reply?.parent.author.viewer) {
        return (
          !!p.reply.parent.author.viewer.following ||
          p.reply.parent.author.did === atp.session?.did
        );
      }
      return true;
    });
  };
  const fetchLatest = React.useCallback(
    async () =>
      postFilter((await bsky.feed.getTimeline({ limit: 1 })).data.feed)[0],
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
