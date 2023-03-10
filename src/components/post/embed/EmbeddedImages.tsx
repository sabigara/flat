import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import styles from "./EmbeddedImages.module.scss";

type Props = {
  embed: AppBskyEmbedImages.Presented;
  className?: string;
};

export default function EmbeddedImages({ embed, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <>
      <div
        className={clsx(styles.container, className, {
          [styles.two]: embed.images.length === 2,
          [styles.three]: embed.images.length === 3,
          [styles.four]: embed.images.length === 4,
        })}
      >
        {embed.images.map((img, i) => (
          <button
            key={img.thumb}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
              setIndex(i);
            }}
          >
            <img src={img.thumb} alt={img.alt} />
          </button>
        ))}
      </div>
      {createPortal(
        <div onClick={(e) => void e.stopPropagation()}>
          <Lightbox
            open={open}
            index={index}
            on={{
              view(index) {
                setIndex(index);
              },
            }}
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
            className={clsx(styles.yarl, "no-nav")}
          />
        </div>,
        document.body
      )}
    </>
  );
}
