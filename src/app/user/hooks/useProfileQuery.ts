import { QueryFunction, useQuery } from "@tanstack/react-query";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

type Params = {
  identifier?: string;
  onSuccess?: () => void;
};

export const fetchProfile = (async ({ queryKey }) => {
  const [, { identifier }] = queryKey;
  if (!identifier) return;
  const resp = await getBskyApi().actor.getProfile({
    actor: identifier,
  });
  return resp.data;
}) satisfies QueryFunction<
  unknown,
  ReturnType<typeof queryKeys.users.single.$>
>;

export function useProfileQuery({ identifier, onSuccess }: Params) {
  return useQuery({
    queryKey: queryKeys.users.single.$({
      identifier,
    }),
    queryFn: fetchProfile,
    onSuccess,
    enabled: !!identifier,
    staleTime: 60 * 60 * 24 * 1000,
    cacheTime: 60 * 60 * 24 * 1000,
  });
}
