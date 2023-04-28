import { useQuery } from "@tanstack/react-query";

import { getRepoDescription } from "@/src/app/account/lib/getRepoDescription";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

type Params = {
  service: string;
  identifier: string;
};

export function useRepoDescriptionQuery(params: Params) {
  return useQuery({
    queryKey: queryKeys.repo.description.$(params),
    queryFn: () => getRepoDescription(params),
  });
}
