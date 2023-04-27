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
  const makeEmbeddedRecord = (embed: AppBskyEmbedRecord.View) => {
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
  };
  if (AppBskyEmbedImages.isView(embed)) {
    return <EmbeddedImages images={embed.images} className={className} />;
  } else if (AppBskyEmbedRecord.isView(embed)) {
    return makeEmbeddedRecord(embed);
  } else if (AppBskyEmbedExternal.isView(embed)) {
    return <EmbeddedExternal external={embed.external} className={className} />;
  } else if (AppBskyEmbedRecordWithMedia.isView(embed)) {
    return (
      <>
        <Embed embed={embed.media} className={className} />
        {makeEmbeddedRecord(embed.record)}
      </>
    );
  } else {
    return null;
  }
}
