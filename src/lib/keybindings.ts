import { isIOS, isMac } from "@/src/lib/platform";

export const modKeyLabel = isMac || isIOS ? "⌘" : "Ctrl";
export const isModKey = (e: KeyboardEvent | MouseEvent) =>
  isMac || isIOS ? e.metaKey : e.ctrlKey;
