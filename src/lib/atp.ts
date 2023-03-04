import { AtpAgent } from "@atproto/api";

export const atp = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (e, session) => {
    switch (e) {
      case "create":
      case "update":
        localStorage.setItem("session", JSON.stringify(session));
        break;
      case "expired":
      case "create-failed":
        localStorage.removeItem("session");
        break;
    }
  },
});

export const bsky = atp.api.app.bsky;
