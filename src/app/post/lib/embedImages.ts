import { AppBskyEmbedImages } from "@atproto/api";

export function embedImages(
  imgs: { cid: string; mimetype: string }[]
): AppBskyEmbedImages.Main {
  return {
    $type: "app.bsky.embed.images",
    images: imgs.map(({ cid, mimetype }) => ({
      alt: "",
      image: {
        cid,
        mimeType: mimetype,
      },
    })),
  };
}
