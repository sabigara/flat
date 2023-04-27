import { AppBskyEmbedExternal } from "@atproto/api";

import { SiteMetadata } from "@/src/lib/siteMetadata";

export function embedExternal(
  external: SiteMetadata
): AppBskyEmbedExternal.Main {
  return {
    $type: "app.bsky.embed.external",
    external: {
      uri: external.url,
      title: external.ogp.title ?? external.title ?? "",
      description: external.ogp.description ?? external.description ?? "",
    },
  };
}
