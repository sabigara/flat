import { AppBskyEmbedImages } from "@atproto/api";
import { type BlobRef } from "@atproto/lexicon";

export function embedImages(
  imgs: { blobRef: BlobRef }[]
): AppBskyEmbedImages.Main {
  return {
    $type: "app.bsky.embed.images",
    images: imgs.map(({ blobRef }) => ({
      alt: "",
      image: blobRef,
    })),
  };
}
