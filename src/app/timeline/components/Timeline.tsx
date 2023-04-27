import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import {
  useInfiniteQuery,
  type QueryKey,
  type QueryFunction,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroller";

import type { AppBskyFeedDefs } from "@atproto/api";

import Post from "@/src/app/post/components/Post";
import PostComposer from "@/src/app/post/components/PostComposer";
import { feedItemToUniqueKey } from "@/src/app/post/lib/feedItemToUniqueKey";
import {
  TimelineInfiniteData,
  mutateTimelineItem,
} from "@/src/app/post/lib/mutateTimelineItem";
import { MutatePostCache } from "@/src/app/post/lib/types";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { TimelineSkelton } from "@/src/app/timeline/components/TimelineSkelton";
import { reloadTimelineForNewPosts } from "@/src/app/timeline/lib/reloadTimelineForNewPosts";
import SpinnerFill from "@/src/components/SpinnerFill";

import styles from "./Timeline.module.scss";

export type TimelineQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string;
    feed: FeedViewPost[];
  },
  K
>;

type Props<K extends QueryKey> = {
  queryKey: K;
  queryFn: TimelineQueryFn<K>;
  fetchNewLatest: () => Promise<AppBskyFeedDefs.FeedViewPost | undefined>;
  maxPages?: number;
  filter?: (
    posts: AppBskyFeedDefs.FeedViewPost[]
  ) => AppBskyFeedDefs.FeedViewPost[];
};

export function Timeline<K extends QueryKey>({
  queryKey,
  queryFn,
  fetchNewLatest,
  maxPages,
  filter = (posts) => posts,
}: Props<K>) {
  const { t } = useTranslation();
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage, allPages) => {
      if (maxPages && allPages.length >= maxPages) return undefined;
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
    refetchOnMount: false,
  });
  const queryClient = useQueryClient();

  const allItems = filter(data?.pages.flatMap((p) => p.feed) ?? []);
  const currentLatestUri = allItems.at(0)?.post.uri;

  const { data: isNewAvailable } = useQuery(
    queryKeys.feed.new.$(queryKey, currentLatestUri, fetchNewLatest),
    async () => {
      const newLatest = await fetchNewLatest();
      if (!newLatest) return false;
      // FIXME: consider about reposts which share the same URI
      return newLatest.post.uri !== currentLatestUri;
    },
    {
      refetchInterval: 15 * 1000, // 15 seconds; the same as the official web app
      refetchOnWindowFocus: import.meta.env.PROD,
    }
  );

  const loadNewPosts = () => {
    reloadTimelineForNewPosts(queryClient, queryKey);
  };

  const revalidateOnPost = () => {
    queryClient.invalidateQueries(queryKey);
  };

  const mutatePostCache: MutatePostCache = ({ uri, fn }) => {
    queryClient.setQueryData<TimelineInfiniteData>(queryKey, (data) =>
      mutateTimelineItem(data, uri, fn)
    );
  };

  if (status === "loading") {
    return <TimelineSkelton count={12} />;
  } else if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => !isFetchingNextPage && fetchNextPage()}
        hasMore={hasNextPage}
        loader={<SpinnerFill key="__loader" />}
      >
        <>
          {allItems.map((item) => (
            <Post
              data={item}
              key={feedItemToUniqueKey(item)}
              revalidate={refetch}
              mutatePostCache={mutatePostCache}
              className={styles.post}
            />
          ))}
          {!hasNextPage && (
            <div className={styles.noMore} key="__noMore">
              nothing more to say...
            </div>
          )}
        </>
      </InfiniteScroll>
      {isNewAvailable && (
        <Button
          size="sm"
          onClick={loadNewPosts}
          variant="soft"
          className={styles.newItemBtn}
          disabled={isFetching && !isFetchingNextPage}
        >
          {isFetching && !isFetchingNextPage ? (
            <Spinner size="sm" />
          ) : (
            t("timeline.load-new-posts")
          )}
        </Button>
      )}
      <PostComposer revalidate={revalidateOnPost} />
    </>
  );
}
