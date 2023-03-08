import EmbeddedImages from "@/src/components/embed/EmbeddedImages";
import EmbeddedRecord from "@/src/components/embed/EmbeddedRecord";
import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
} from "@atproto/api";

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
  } else {
    return null;
  }
}
