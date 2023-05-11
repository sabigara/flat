import { useMatchMedia } from "@/src/lib/useMatchMedia";

export function useMobileSize() {
  return useMatchMedia("screen and (max-width: 48rem)");
}
