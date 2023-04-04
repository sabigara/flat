import { AtpAgent } from "@atproto/api";
import { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { isObj, hasProp } from "@atproto/api/src/client/util";

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

export function isReasonRepost(v: unknown): v is ReasonRepost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.feedViewPost#reasonRepost"
  );
}
