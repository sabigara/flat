import React from "react";
import { useOutletContext } from "react-router-dom";

import { RootContext } from "@/src/app/RootRoute/RootRoute";
import { Feed, FeedQueryFn } from "@/src/components/Feed";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries/queriesKeys";
import Seo from "@/src/seo/Seo";

import styles from "./HomeTimelineRoute.module.scss";

export function HomeTimelineRoute() {
  const { composer } = useOutletContext<RootContext>();
  const queryKey = queryKeys.feed.home.$;
  const queryFn: FeedQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.feed.getTimeline({
      limit: 25,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { before: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const fetchLatest = React.useCallback(
    async () => (await bsky.feed.getTimeline({ limit: 1 })).data.feed[0],
    []
  );
  return (
    <>
      <Seo title="Flat" />
      <div className={styles.container}>
        <Feed
          queryKey={queryKey}
          queryFn={queryFn}
          fetchLatestOne={fetchLatest}
          onClickReply={composer.handleClickReply}
        />
      </div>
    </>
  );
}
