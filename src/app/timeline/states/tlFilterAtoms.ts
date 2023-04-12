import { atomWithStorage } from "jotai/utils";

import { TlFilterReply, TlFilterRepost } from "@/src/app/timeline/lib/types";
import { storageKeys } from "@/src/lib/storage";

export const tlFilterReplyAtom = atomWithStorage<TlFilterReply>(
  storageKeys.config.tlFilters.reply.$,
  "following"
);
export const tlFilterRepostAtom = atomWithStorage<TlFilterRepost>(
  storageKeys.config.tlFilters.repost.$,
  "latest"
);
