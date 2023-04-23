import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";
import GLightbox from "glightbox";
import React from "react";

import "glightbox/dist/css/glightbox.min.css";
import styles from "./EmbeddedImages.module.scss";

type Props = {
  images: AppBskyEmbedImages.ViewImage[];
  className?: string;
};

export default function EmbeddedImages({ images, className }: Props) {
  const gl = React.useMemo(
    () =>
      GLightbox({
        elements: images.map(({ fullsize }) => ({
          href: fullsize,
          type: "image",
        })),
        dragToleranceY: 0,
      }),
    [images]
  );
  const handleClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    gl.openAt(i);
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
    </>
  );
}
