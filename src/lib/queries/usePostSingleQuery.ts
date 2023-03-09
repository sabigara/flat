import { useQuery } from "@tanstack/react-query";

import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

type Params = {
  /* did */
  user: string;
  rkey: string;
};

export function usePostSingleQuery({ user, rkey }: Params) {
  return useQuery({
    queryKey: queryKeys.posts.single.$({
      user,
      rkey,
    }),
    async queryFn() {
      const resp = await bsky.feed.post.get({
        user,
        rkey,
      });
      return resp.value;
    },
    staleTime: 60 * 60 * 24 * 1000,
  });
}
