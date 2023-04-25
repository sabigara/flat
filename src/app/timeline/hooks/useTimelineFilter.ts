import { useAtomValue } from "jotai";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import {
  TlFilterFn,
  tlFiltersToFn,
} from "@/src/app/timeline/lib/timelineFilters";
import { atp } from "@/src/lib/atp";

export function useTimelineFilter() {
  const {
    tlFilters: { reply, repost },
  } = useAtomValue(settingsAtom);
  const timelineFilter: TlFilterFn = atp.session
    ? tlFiltersToFn({ reply, repost }, atp.session.did)
    : (posts) => posts;
  return {
    timelineFilter,
  };
}
