import { useImmerAtom } from "jotai-immer";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Theme } from "@/src/app/theme/lib/types";
import { useMatchMedia } from "@/src/lib/useMatchMedia";

export function useTheme(initialState: Theme): {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (newVal: Theme) => void;
} {
  const [settings, setSettings] = useImmerAtom(settingsAtom);
  const matches = useMatchMedia(
    "(prefers-color-scheme: dark)",
    initialState === "dark"
  );
  const resolvedTheme = (() => {
    if (settings.theme !== "system") return settings.theme;
    return matches ? "dark" : "light";
  })();

  const setAndPersistTheme = (newVal: Theme) => {
    setSettings((draft) => void (draft.theme = newVal));
  };

  return {
    theme: settings.theme,
    resolvedTheme,
    setTheme: setAndPersistTheme,
  };
}
