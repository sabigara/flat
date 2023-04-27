import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { SiteMetadata, fetchSiteMetadata } from "@/src/lib/siteMetadata";

type Params = {
  uri: string;
  onSuccess?: (data: SiteMetadata) => void;
};

export function useSiteMetadata({ uri, onSuccess }: Params) {
  return useQuery({
    queryKey: queryKeys.siteMetadata.$({ uri }),
    queryFn: async () => fetchSiteMetadata(uri),
    onSuccess,
    enabled: !!uri,
  });
}
