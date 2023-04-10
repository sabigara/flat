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
        latestId: string | undefined,
        fetchLatestOne: () => Promise<AppBskyFeedDefs.FeedViewPost>
      ) => [key, { latestId, fetchLatestOne }] as const,
    },
  },
  posts: {
    single: {
      $: (params: { uri?: string }) => ["posts", params] as const,
    },
  },
  users: {
    single: {
      $: (params: { identifier?: string }) => ["users", params] as const,
    },
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
