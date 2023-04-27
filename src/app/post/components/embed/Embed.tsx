import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
} from "@atproto/api";
import clsx from "clsx";

import EmbeddedExternal from "@/src/app/post/components/embed/EmbeddedExternal";
import EmbeddedImages from "@/src/app/post/components/embed/EmbeddedImages";
import EmbeddedRecord from "@/src/app/post/components/embed/EmbeddedRecord";

import styles from "./Embed.module.scss";

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
  const makeEmbeddedRecord = (
    embed: AppBskyEmbedRecord.View,
    className?: string
  ) => {
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
    return makeEmbeddedRecord(embed, className);
  } else if (AppBskyEmbedExternal.isView(embed)) {
    return <EmbeddedExternal external={embed.external} className={className} />;
  } else if (AppBskyEmbedRecordWithMedia.isView(embed)) {
    return (
      // apply className only to the wrapper
      <div className={clsx(className, styles.multiple)}>
        <Embed embed={embed.media} />
        {makeEmbeddedRecord(embed.record)}
      </div>
    );
  } else {
    return null;
  }
}
