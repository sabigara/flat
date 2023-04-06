import { AtpAgent, RichText } from "@atproto/api";

import { storageKeys } from "@/src/lib/storage";

export const atp = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (e, session) => {
    switch (e) {
      case "create":
      case "update":
        localStorage.setItem(storageKeys.session.$, JSON.stringify(session));
        break;
      case "expired":
      case "create-failed":
        localStorage.removeItem(storageKeys.session.$);
        break;
    }
  },
});

export const bsky = atp.api.app.bsky;

export function isRichTextValid(rt: RichText) {
  return rt.length <= 3000 && rt.graphemeLength <= 300;
}

export function isPostValid(rt: RichText, imageLen: number) {
  return isRichTextValid(rt) && (rt.graphemeLength > 0 || imageLen > 0);
}
