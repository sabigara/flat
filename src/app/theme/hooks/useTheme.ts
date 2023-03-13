import React from "react";

import { Theme } from "@/src/app/theme/lib/types";
import { storageKeys } from "@/src/lib/storage";
import { useMatchMedia } from "@/src/lib/useMatchMedia";

export function useTheme(initialState: Theme): {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (newVal: Theme) => void;
} {
  const [theme, setTheme] = React.useState(initialState);
  const matches = useMatchMedia(
    "(prefers-color-scheme: dark)",
    initialState === "dark"
  );
  const resolvedTheme = (() => {
    if (theme !== "system") return theme;
    return matches ? "dark" : "light";
  })();

  const setAndPersistTheme = (newVal: Theme) => {
    localStorage.setItem(storageKeys.config.theme.$, newVal);
    setTheme(newVal);
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setAndPersistTheme,
  };
}
