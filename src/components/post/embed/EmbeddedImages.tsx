import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";

import styles from "./EmbeddedImages.module.scss";

type Props = {
  embed: AppBskyEmbedImages.Presented;
  className?: string;
};

export default function EmbeddedImages({ embed, className }: Props) {
  return (
    <div
      className={clsx(styles.container, className, {
        [styles.two]: embed.images.length === 2,
        [styles.three]: embed.images.length === 3,
        [styles.four]: embed.images.length === 4,
      })}
    >
      {embed.images.map((img) => (
        <a
          key={img.thumb}
          href={img.fullsize}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={img.thumb} alt={img.alt} />
        </a>
      ))}
    </div>
  );
}
