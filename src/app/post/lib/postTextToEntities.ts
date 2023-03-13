import { AppBskyFeedPost } from "@atproto/api";
import { find } from "linkifyjs";

// TODO: Support mention
// `linkify-plugin-mention` doesn't support usernames that include dots
export function postTextToEntities(text: string): AppBskyFeedPost.Entity[] {
  const urls = find(text, "url");
  return urls.map((url) => ({
    type: "link",
    index: {
      start: url.start,
      end: url.end,
    },
    value: url.href,
  }));
}
