import { AppBskyEmbedRecord, AppBskyFeedDefs } from "@atproto/api";

export function embedRecord(
  record: AppBskyFeedDefs.PostView,
): AppBskyEmbedRecord.Main {
  return {
    $type: "app.bsky.embed.record",
    record: {
      cid: record.cid,
      uri: record.uri,
    },
  };
}
