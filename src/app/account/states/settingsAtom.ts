import { atomWithStorage, createJSONStorage } from "jotai/utils";

import { Settings } from "@/src/app/account/lib/types";
import { storageKeys } from "@/src/lib/storage";

function createMergedJsonStorage(initialState: Settings) {
  const storage = createJSONStorage<Settings>(() => localStorage);
  const getItem = (key: string) => {
    const value = storage.getItem(key);
    return { ...(typeof value === "symbol" ? {} : value), ...initialState };
  };
  return { ...storage, getItem };
}

const initialState: Settings = {
  theme: "light",
  tlFilters: {
    reply: "following",
    repost: "latest",
  },
  postImageLayout: "stack",
  mode: "normal",
};

export const settingsAtom = atomWithStorage(
  storageKeys.settings.$,
  initialState,
  createMergedJsonStorage(initialState)
);
