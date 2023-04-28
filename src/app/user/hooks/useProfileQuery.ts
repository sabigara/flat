import { useQuery } from "@tanstack/react-query";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

type Params = {
  identifier?: string;
};

export function useProfileQuery({ identifier }: Params) {
  return useQuery({
    queryKey: queryKeys.users.single.$({
      identifier,
    }),
    async queryFn() {
      if (!identifier) return;
      const resp = await getBskyApi().actor.getProfile({
        actor: identifier,
      });
      return resp.data;
    },
    enabled: !!identifier,
    staleTime: 60 * 60 * 24 * 1000,
    cacheTime: 60 * 60 * 24 * 1000,
  });
}
