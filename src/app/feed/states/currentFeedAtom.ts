import { atomWithStorage } from "jotai/utils";

import { storageKeys } from "@/src/lib/storage";

export const currentFeedAtom = atomWithStorage(storageKeys.currentFeed.$, "");
