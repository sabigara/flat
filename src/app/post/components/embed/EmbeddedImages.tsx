import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import styles from "./EmbeddedImages.module.scss";

type Props = {
  images: AppBskyEmbedImages.ViewImage[];
  className?: string;
};

export default function EmbeddedImages({ images, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const handleClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setOpen(true);
    setIndex(i);
  };
  const handleView = (i: number) => {
    setIndex(i);
  };
  return (
    <>
      <div
        className={clsx(styles.container, className, {
          [styles.two]: images.length === 2,
          [styles.three]: images.length === 3,
          [styles.four]: images.length === 4,
        })}
      >
        {images.map((img, i) => (
          <button key={img.thumb} onClick={(e) => handleClick(e, i)}>
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
              view: handleView,
            }}
            close={() => setOpen(false)}
            slides={images.map((img) => ({
              src: img.fullsize,
            }))}
            animation={{
              navigation: {
                duration: 1,
                easing: "linear",
              },
            }}
            controller={{ closeOnBackdropClick: true, touchAction: "pan-y" }}
            carousel={{ finite: true }}
            render={{
              buttonZoomIn: () => null,
              buttonZoomOut: () => null,
            }}
            plugins={[Zoom]}
            className={styles.yarl}
          />
        </div>,
        document.body
      )}
    </>
  );
}
