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
    author: (handle: string) => ({
      $: ["feed", { authorId: handle }] as const,
      likes: ["feed", { authorId: handle }, "likes"] as const,
    }),
    custom: (feed: string) => ({
      $: ["feed", { feed }] as const,
    }),
    new: {
      $: (
        key: QueryKey,
        currentLatestId: string | undefined,
        fetchNewLatestOne?: () => Promise<
          AppBskyFeedDefs.FeedViewPost | undefined
        >
      ) => [key, { currentLatestId, fetchNewLatestOne }] as const,
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
  siteMetadata: {
    $: (params: { uri: string }) => ["siteMetadata", params] as const,
  },
  repo: {
    description: {
      $: (params: { service: string; identifier: string }) =>
        ["repo", "description", params] as const,
    },
  },
  search: {
    $: (params: { term: string }) => ["search", params] as const,
  },
};
