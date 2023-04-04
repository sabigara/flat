import { AppBskyFeedDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { bsky } from "@/src/lib/atp";

type Params = {
  uri: string | undefined;
};

export function usePostThreadQuery({ uri }: Params) {
  return useQuery({
    queryKey: queryKeys.posts.single.$({
      uri,
    }),
    async queryFn() {
      if (!uri) return;
      const resp = await bsky.feed.getPostThread({
        uri: uri,
      });

      // TODO: should throw?
      if (!AppBskyFeedDefs.isThreadViewPost(resp.data.thread)) return null;

      return resp.data.thread;
    },
    enabled: !!uri,
  });
}
