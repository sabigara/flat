import { getDefaultStore } from "jotai";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Theme } from "@/src/app/theme/lib/types";

export function getTheme(): Theme {
  return getDefaultStore().get(settingsAtom).theme;
}
