import React from "react";

export function useMatchMedia(
  mediaQuery: string,
  initialState = false
): boolean {
  const matchMediaList = React.useMemo(
    () =>
      typeof window === "undefined" ? undefined : window.matchMedia(mediaQuery),
    [mediaQuery]
  );

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      matchMediaList?.addEventListener("change", onStoreChange);
      return () => matchMediaList?.removeEventListener("change", onStoreChange);
    },
    [matchMediaList]
  );

  return React.useSyncExternalStore(
    subscribe,
    () => matchMediaList?.matches ?? initialState,
    () => initialState
  );
}
