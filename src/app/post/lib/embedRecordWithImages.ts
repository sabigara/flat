import {
  AppBskyEmbedRecordWithMedia,
  AppBskyFeedDefs,
  BlobRef,
} from "@atproto/api";

import { embedImages } from "@/src/app/post/lib/embedImages";

type Params = {
  record: AppBskyFeedDefs.PostView;
  images: { blobRef: BlobRef; alt?: string }[];
};

export function embedRecordWithImages({
  record,
  images,
}: Params): AppBskyEmbedRecordWithMedia.Main {
  return {
    $type: "app.bsky.embed.recordWithMedia",
    record: {
      record,
    },
    media: embedImages(images),
  };
}
