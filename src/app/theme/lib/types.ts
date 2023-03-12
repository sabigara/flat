export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];
