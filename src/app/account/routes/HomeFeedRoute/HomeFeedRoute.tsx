import { useAtom, useAtomValue } from "jotai";

import { useHomeFeedProps } from "@/src/app/account/hooks/useHomeFeedProps";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Feed } from "@/src/app/feed/components/Feed";
import { FeedGeneratorSelector } from "@/src/app/feed/components/FeedGeneratorSelector";
import { currentFeedAtom } from "@/src/app/feed/states/currentFeedAtom";
import Seo from "@/src/app/seo/Seo";
import { msInMinutes } from "@/src/app/time/lib/msInMinutes";

import styles from "./HomeFeedRoute.module.scss";

export function HomeFeedRoute() {
  const [feed, setFeed] = useAtom(currentFeedAtom);
  const handleChangeFeed = (newVal?: string) => {
    setFeed(newVal ?? "");
    window.scrollTo({
      top: 0,
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
          staleTime={msInMinutes(60)}
          aggregateThreads={inFeedThreadMode === "aggregate"}
        />
      </div>
    </>
  );
}
