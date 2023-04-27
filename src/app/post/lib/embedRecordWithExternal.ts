import { AppBskyEmbedRecordWithMedia, AppBskyFeedDefs } from "@atproto/api";

import { embedExternal } from "@/src/app/post/lib/embedExternal";
import { SiteMetadata } from "@/src/lib/siteMetadata";

type Params = {
  record: AppBskyFeedDefs.PostView;
  external: SiteMetadata;
};

export function embedRecordWithExternal({
  record,
  external,
}: Params): AppBskyEmbedRecordWithMedia.Main {
  return {
    $type: "app.bsky.embed.recordWithMedia",
    record: {
      record,
    },
    media: embedExternal(external),
  };
}
