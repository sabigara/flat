import { isMac } from "@/src/lib/platform";

export const modKeyLabel = isMac ? "⌘" : "Ctrl";
export const isModKey = (e: KeyboardEvent) => (isMac ? e.metaKey : e.ctrlKey);
