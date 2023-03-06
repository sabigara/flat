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
        fetchLatest: () => Promise<AppBskyFeedFeedViewPost.Main | undefined>
      ) => [...key, { latestDate, fetchLatest }] as const,
    },
  },
};
