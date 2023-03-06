import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { QueryKey } from "@tanstack/react-query";

export const queryKeys = {
  feed: {
    home: {
      $: ["feed"] as const,
    },
    author: {
      $: (handle: string) => ["feed", { authorId: handle }] as const,
    },
    new: {
      $: (
        key: QueryKey,
        latestDate: Date | undefined,
        fetchLatestOne: () => Promise<AppBskyFeedFeedViewPost.Main>
      ) => [key, { latestDate, fetchLatestOne }] as const,
    },
  },
};
