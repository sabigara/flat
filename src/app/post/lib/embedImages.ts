import { AppBskyEmbedImages } from "@atproto/api";
import { type BlobRef } from "@atproto/lexicon";

export function embedImages(
  imgs: { blobRef: BlobRef; alt?: string }[]
): AppBskyEmbedImages.Main {
  return {
    $type: "app.bsky.embed.images",
    images: imgs.map(({ blobRef, alt }) => ({
      alt: alt ?? "",
      image: blobRef,
    })),
  };
}
