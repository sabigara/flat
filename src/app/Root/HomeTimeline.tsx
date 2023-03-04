import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { bsky } from "@/src/lib/atp";
import React from "react";

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

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <div
      ref={parentRef}
      className="List"
      style={{
        height: `100dvh`,
        width: `100%`,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const item = allRows[virtualRow.index];
          // this happens
          if (!item) return null;
          const { post, reason } = item;

          return (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
                padding: "1rem",
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  "Loading more..."
                ) : (
                  "Nothing more to load"
                )
              ) : (
                <article>
                  {reason && (
                    <div>
                      {reason?.$type as string} by{" "}
                      {(reason?.by as any)?.displayName}
                    </div>
                  )}
                  <div>
                    {post.author.displayName} - {post.author.handle}
                  </div>
                  <div>{(post.record as any).text}</div>
                </article>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
