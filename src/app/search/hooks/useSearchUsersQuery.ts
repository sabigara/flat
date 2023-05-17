import { useInfiniteQuery } from "@tanstack/react-query";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

export function useSearchUsersQuery(term: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.search.$({ term }),
    queryFn: async ({ pageParam }) => {
      const resp = await getBskyApi().actor.searchActors({
        term,
        limit: 30,
        cursor: pageParam?.cursor,
      });
      return resp.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
  });
}
