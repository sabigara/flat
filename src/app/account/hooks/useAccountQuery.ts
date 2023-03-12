import { useQuery } from "@tanstack/react-query";

import { getAccount } from "@/src/app/account/lib/getAccount";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { msInMinutes } from "@/src/app/time/lib/msInMinutes";

export function useAccountQuery() {
  return useQuery(queryKeys.session.$, getAccount, {
    staleTime: msInMinutes(60),
  });
}
