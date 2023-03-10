import {
  useInfiniteQuery,
  type QueryKey,
  type QueryFunction,
  useQueryClient,
} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";

import type { AppBskyActorRef } from "@atproto/api";

import SpinnerFill from "@/src/components/SpinnerFill";
import UserListItem from "@/src/components/user/UserListItem";

import styles from "./UserList.module.scss";

export type UserListQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string;
    users: AppBskyActorRef.WithInfo[];
  },
  K
>;

type Props<K extends QueryKey> = {
  queryKey: K;
  queryFn: UserListQueryFn<K>;
};

export function UserList<K extends QueryKey>({ queryKey, queryFn }: Props<K>) {
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
    getNextPageParam: (lastPage) => {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
    refetchOnMount: false,
  });
  const queryClient = useQueryClient();
  const revalidate = () => void queryClient.invalidateQueries(queryKey);

  const allItems = data?.pages.flatMap((p) => p.users) ?? [];

  if (status === "loading") {
    return <SpinnerFill />;
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
            <UserListItem
              user={item}
              revalidate={revalidate}
              key={item.did}
              className={styles.item}
            />
          ))}
          {!hasNextPage && (
            <div className={styles.noMore} key="__noMore">
              nothing more to show...
            </div>
          )}
        </>
      </InfiniteScroll>
    </>
  );
}
