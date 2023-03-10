import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
} from "@atproto/api";

import EmbeddedExternal from "@/src/components/post/embed/EmbeddedExternal";
import EmbeddedImages from "@/src/components/post/embed/EmbeddedImages";
import EmbeddedRecord from "@/src/components/post/embed/EmbeddedRecord";

type Props = {
  embed:
    | AppBskyEmbedExternal.Presented
    | AppBskyEmbedImages.Presented
    | AppBskyEmbedRecord.Presented
    | {
        $type: string;
        [k: string]: unknown;
      };
  className?: string;
};

export default function Embed({ embed, className }: Props) {
  if (AppBskyEmbedImages.isPresented(embed)) {
    return <EmbeddedImages embed={embed} className={className} />;
    // TODO: also support AppBskyEmbedRecord.isPresentedNotFound ?
  } else if (AppBskyEmbedRecord.isPresentedRecord(embed.record)) {
    // ignore the others
    return <EmbeddedRecord record={embed.record} className={className} />;
  } else if (AppBskyEmbedExternal.isPresented(embed)) {
    return <EmbeddedExternal external={embed.external} className={className} />;
  } else {
    return null;
  }
}
