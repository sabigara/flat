import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
} from "@atproto/api";

import EmbeddedExternal from "@/src/app/post/components/embed/EmbeddedExternal";
import EmbeddedImages from "@/src/app/post/components/embed/EmbeddedImages";
import EmbeddedRecord from "@/src/app/post/components/embed/EmbeddedRecord";

type Props = {
  embed:
    | AppBskyEmbedExternal.View
    | AppBskyEmbedImages.View
    | AppBskyEmbedRecord.View
    | AppBskyEmbedRecordWithMedia.View
    | {
        $type: string;
        [k: string]: unknown;
      };
  isLink?: boolean;
  className?: string;
};

export default function Embed({ embed, isLink, className }: Props) {
  if (AppBskyEmbedImages.isView(embed)) {
    return <EmbeddedImages images={embed.images} className={className} />;
  } else if (AppBskyEmbedRecord.isView(embed)) {
    // TODO: support not found?
    if (AppBskyEmbedRecord.isViewNotFound(embed)) return null;
    if (!AppBskyEmbedRecord.isViewRecord(embed.record)) return null;
    return (
      <EmbeddedRecord
        record={embed.record}
        isLink={isLink}
        className={className}
      />
    );
  } else if (AppBskyEmbedExternal.isView(embed)) {
    return <EmbeddedExternal external={embed.external} className={className} />;
  } else {
    return null;
  }
}
