import { Theme } from "@/src/app/theme/lib/types";
import { storageKeys } from "@/src/lib/storage";

export function getTheme(): Theme {
  return (
    (localStorage.getItem(storageKeys.config.theme.$) as Theme | null) ??
    "system"
  );
}
