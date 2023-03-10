import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";
import React from "react";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import styles from "./EmbeddedImages.module.scss";

type Props = {
  embed: AppBskyEmbedImages.Presented;
  className?: string;
};

export default function EmbeddedImages({ embed, className }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div
        className={clsx(styles.container, className, {
          [styles.two]: embed.images.length === 2,
          [styles.three]: embed.images.length === 3,
          [styles.four]: embed.images.length === 4,
        })}
      >
        {embed.images.map((img) => (
          <button
            key={img.thumb}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <img src={img.thumb} alt={img.alt} />
          </button>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={embed.images.map((img) => ({
          src: img.fullsize,
        }))}
        animation={{
          navigation: {
            duration: 1,
            easing: "linear",
          },
        }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: true }}
        className={styles.yarl}
      />
    </>
  );
}
