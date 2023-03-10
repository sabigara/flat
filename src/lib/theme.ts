import React from "react";

import { storageKeys } from "@/src/lib/storage";
import { useMatchMedia } from "@/src/lib/useMatchMedia";

export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

export function getTheme(): Theme {
  return (
    (localStorage.getItem(storageKeys.config.theme.$) as Theme | null) ??
    "system"
  );
}

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
