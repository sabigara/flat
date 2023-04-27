import { AppBskyEmbedExternal } from "@atproto/api";

import { SiteMetadata } from "@/src/lib/siteMetadata";

export function embedExternal(
  metadata: SiteMetadata
): AppBskyEmbedExternal.Main {
  return {
    $type: "app.bsky.embed.external",
    external: {
      uri: metadata.url,
      title: metadata.ogp.title ?? metadata.title ?? "",
      description: metadata.ogp.description ?? metadata.description ?? "",
    },
  };
}
