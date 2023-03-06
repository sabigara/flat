import {
  useInfiniteQuery,
  type QueryKey,
  type QueryFunction,
} from "@tanstack/react-query";
import type { AppBskyFeedFeedViewPost } from "@atproto/api";
import { Spinner } from "@camome/core/Spinner";
import Post from "@/src/components/Post";
import InfiniteScroll from "react-infinite-scroller";
import SpinnerFill from "@/src/components/SpinnerFill";

import styles from "./Feed.module.scss";

export type FeedQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string;
    feed: AppBskyFeedFeedViewPost.Main[];
  },
  K
>;

type Props<K extends QueryKey> = {
  queryKey: K;
  queryFn: FeedQueryFn<K>;
  maxPages?: number;
};

export function Feed<K extends QueryKey>({
  queryKey,
  queryFn,
  maxPages,
}: Props<K>) {
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage, allPages) => {
      if (maxPages && allPages.length >= maxPages) return undefined;
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
    staleTime: 60 * 3 * 1000,
  });
  const allItems = data?.pages.flatMap((p) => p.feed) ?? [];

  if (status === "loading") {
    return (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );
  } else if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => !isFetchingNextPage && fetchNextPage()}
      hasMore={hasNextPage}
      loader={<SpinnerFill />}
    >
      <>
        {allItems.map((item) => (
          <Post data={item} />
        ))}
        {!hasNextPage && (
          <div className={styles.noMore}>nothing more to say...</div>
        )}
      </>
    </InfiniteScroll>
  );
}
