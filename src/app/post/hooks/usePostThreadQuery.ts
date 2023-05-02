import { AppBskyFeedDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

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
      try {
        const resp = await getBskyApi().feed.getPostThread({
          uri: uri,
        });
        if (!AppBskyFeedDefs.isThreadViewPost(resp.data.thread)) return null;
        return resp.data.thread;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    enabled: !!uri,
  });
}
