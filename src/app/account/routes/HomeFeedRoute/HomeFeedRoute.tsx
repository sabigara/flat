import { useAtomValue } from "jotai";

import { useHomeFeedProps } from "@/src/app/account/hooks/useHomeFeedProps";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Feed } from "@/src/app/feed/components/Feed";
import { FeedFilter } from "@/src/app/feed/components/FeedFilter";
import Seo from "@/src/app/seo/Seo";

import styles from "./HomeFeedRoute.module.scss";

export function HomeFeedRoute() {
  const { queryKey, queryFn, fetchLatest, feedFilter } = useHomeFeedProps({});
  const { inFeedThreadMode } = useAtomValue(settingsAtom);

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
