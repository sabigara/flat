import EmbeddedImages from "@/src/components/embed/EmbeddedImages";
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
  } else {
    return null;
  }
}
