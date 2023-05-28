import { AppBskyActorDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";

import { getBskyApi } from "@/src/app/account/states/atp";
import { msInMinutes } from "@/src/app/time/lib/msInMinutes";

// pinned only currently
export function useCustomFeedsQuery() {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      const prefResp = await getBskyApi().actor.getPreferences();
      const feedsPref = prefResp.data.preferences
        .filter(AppBskyActorDefs.isSavedFeedsPref)
        .at(0);
      if (!feedsPref) return [];
      const feedsResp = await getBskyApi().feed.getFeedGenerators({
        feeds: feedsPref.pinned,
      });
      return feedsResp.data.feeds;
    },
    staleTime: msInMinutes(5),
  });
}
