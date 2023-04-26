import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { fetchSiteMetadata } from "@/src/lib/siteMetadata";

export function useSiteMetadata(url: string) {
  return useQuery({
    queryKey: queryKeys.siteMetadata.$({ url }),
    queryFn: async () => fetchSiteMetadata(url),
    enabled: !!url,
  });
}
