import { AppBskyEmbedRecord, AppBskyFeedPost } from "@atproto/api";

export function embedRecord(
  record: AppBskyFeedPost.View
): AppBskyEmbedRecord.Main {
  return {
    $type: "app.bsky.embed.record",
    record,
  };
}
