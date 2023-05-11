import { useQuery } from "@tanstack/react-query";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.count.$,
    async queryFn() {
      const resp = await getBskyApi().notification.getUnreadCount();
      return resp.data.count;
    },
    refetchInterval: 60 * 1 * 1000, // 1 minute
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}
