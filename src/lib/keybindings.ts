import { isIPhone, isMac } from "@/src/lib/platform";

export const modKeyLabel = isMac || isIPhone ? "⌘" : "Ctrl";
export const isModKey = (e: KeyboardEvent | MouseEvent) =>
  isMac || isIPhone ? e.metaKey : e.ctrlKey;
