import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { bsky } from "@/src/lib/atp";
import React from "react";
import clsx from "clsx";

import styles from "./HomeTimeline.module.scss";
import Post from "@/src/components/Post";

export function HomeTimeline() {
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["home-timeline"],
    queryFn: async ({ pageParam }) => {
      const resp = await bsky.feed.getTimeline({
        limit: 10,
        // passing `undefined` breaks the query somehow
        ...(pageParam ? { before: pageParam.cursor } : {}),
      });
      // TODO: ?????
      if (!resp.success) throw new Error("Fetch error");
      return resp.data;
    },
    getNextPageParam: (lastPage) => {
      return { cursor: lastPage.cursor };
    },
  });
  const parentRef = React.useRef<HTMLDivElement>(null!);
  const allRows = data?.pages.flatMap((p) => p.feed) ?? [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <div ref={parentRef} className={clsx(styles.container, "scrollbar")}>
      <div
        className={styles.inner}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const item = allRows[virtualRow.index];
          // this happens
          if (!item) return null;

          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={styles.row}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  "Loading more..."
                ) : (
                  "Nothing more to load"
                )
              ) : (
                <Post data={item} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
