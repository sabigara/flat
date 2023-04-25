import { atomWithStorage } from "jotai/utils";

import { Settings } from "@/src/app/account/lib/types";
import { storageKeys } from "@/src/lib/storage";

export const settingsAtom = atomWithStorage<Settings>(storageKeys.settings.$, {
  theme: "light",
  tlFilters: {
    reply: "following",
    repost: "latest",
  },
  postImageLayout: "stack",
});
