import { useAtomValue } from "jotai";

import { getAtpAgent } from "@/src/app/account/states/atp";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import {
  TlFilterFn,
  tlFiltersToFn,
} from "@/src/app/timeline/lib/timelineFilters";

export function useTimelineFilter() {
  const {
    tlFilters: { reply, repost },
  } = useAtomValue(settingsAtom);
  const atp = getAtpAgent();
  const timelineFilter: TlFilterFn = atp.session
    ? tlFiltersToFn({ reply, repost }, atp.session.did)
    : (posts) => posts;
  return {
    timelineFilter,
  };
}
