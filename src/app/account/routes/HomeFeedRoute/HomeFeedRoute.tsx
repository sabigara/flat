import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";

import { useHomeFeedProps } from "@/src/app/account/hooks/useHomeFeedProps";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Feed } from "@/src/app/feed/components/Feed";
import { FeedGeneratorSelector } from "@/src/app/feed/components/FeedGeneratorSelector";
import Seo from "@/src/app/seo/Seo";

import styles from "./HomeFeedRoute.module.scss";

export function HomeFeedRoute() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const feed = new URLSearchParams(search).get("feed") ?? undefined;
  const handleChangeFeed = (newVal?: string) => {
    navigate({
      search: newVal ? new URLSearchParams({ feed: newVal }).toString() : "",
    });
  };
  const { queryKey, queryFn, fetchLatest, feedFilter } = useHomeFeedProps({
    feed,
  });
  const { inFeedThreadMode } = useAtomValue(settingsAtom);

  return (
    <>
      <Seo title="Flat" />
      <div className={styles.container}>
        <FeedGeneratorSelector
          value={feed}
          onChange={handleChangeFeed}
          className={styles.feedGenerator}
        />
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
