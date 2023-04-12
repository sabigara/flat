import { useAtomValue } from "jotai";

import {
  TlFilterFn,
  tlFiltersToFn,
} from "@/src/app/timeline/lib/timelineFilters";
import {
  tlFilterReplyAtom,
  tlFilterRepostAtom,
} from "@/src/app/timeline/states/tlFilterAtoms";
import { atp } from "@/src/lib/atp";

export function useTimelineFilter() {
  const tlFilterReply = useAtomValue(tlFilterReplyAtom);
  const tlFilterRepost = useAtomValue(tlFilterRepostAtom);
  const timelineFilter: TlFilterFn = atp.session
    ? tlFiltersToFn(
        { reply: tlFilterReply, repost: tlFilterRepost },
        atp.session.did
      )
    : (posts) => posts;
  return {
    timelineFilter,
  };
}
