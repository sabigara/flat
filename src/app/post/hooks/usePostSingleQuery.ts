import { AppBskyFeedDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { bsky } from "@/src/lib/atp";

type Params = {
  uri: string;
};

export function usePostSingleQuery({ uri }: Params) {
  return useQuery({
    queryKey: queryKeys.posts.single.$({
      uri,
    }),
    async queryFn() {
      const resp = await bsky.feed.getPostThread({
        uri,
      });

      // TODO: should throw?
      if (!AppBskyFeedDefs.isThreadViewPost(resp.data.thread)) return null;

      return resp.data.thread;
    },
    staleTime: 60 * 60 * 24 * 1000,
    cacheTime: 60 * 60 * 24 * 1000,
  });
}
