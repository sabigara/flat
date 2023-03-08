import { isIPhone, isMac } from "@/src/lib/platform";

export const modKeyLabel = isMac || isIPhone ? "⌘" : "Ctrl";
export const isModKey = (e: KeyboardEvent) => (isMac ? e.metaKey : e.ctrlKey);
