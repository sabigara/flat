import { useAtomValue } from "jotai";

import { getAtpAgent } from "@/src/app/account/states/atp";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { FeedFilterFn, feedFiltersToFn } from "@/src/app/feed/lib/feedFilters";

export function useFeedFilter() {
  const {
    tlFilters: { reply, repost },
  } = useAtomValue(settingsAtom);
  const atp = getAtpAgent();
  const feedFilter: FeedFilterFn = atp.session
    ? feedFiltersToFn({ reply, repost }, atp.session.did)
    : (posts) => posts;
  return {
    feedFilter,
  };
}
