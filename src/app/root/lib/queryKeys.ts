import { AppBskyFeedDefs } from "@atproto/api";
import { QueryKey } from "@tanstack/react-query";

export const queryKeys = {
  session: {
    $: ["session"],
  },
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
        fetchLatestOne: () => Promise<AppBskyFeedDefs.FeedViewPost>
      ) => [key, { latestDate, fetchLatestOne }] as const,
    },
  },
  posts: {
    single: {
      $: (params: { uri: string }) => ["posts", params] as const,
    },
  },
  users: {
    followers: {
      $: (params: { user: string }) => ["users", "followers", params] as const,
    },
    following: {
      $: (params: { user: string }) => ["users", "following", params] as const,
    },
  },
  notifications: {
    $: ["notifications"] as const,
    count: {
      $: ["notifications", "count"] as const,
    },
  },
};
