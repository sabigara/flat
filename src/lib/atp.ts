import AtpAgent, { type ComAtprotoSessionCreate } from "@atproto/api";

export const atp = new AtpAgent({ service: "https://bsky.social" });
export const bsky = atp.api.app.bsky;
