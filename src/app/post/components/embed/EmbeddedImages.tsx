import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";
import React from "react";

import "glightbox/dist/css/glightbox.min.css";
import { useLightbox } from "@/src/app/content/image/hooks/useLightbox";

import styles from "./EmbeddedImages.module.scss";

type Props = {
  images: AppBskyEmbedImages.ViewImage[];
  className?: string;
};

export default function EmbeddedImages({ images, className }: Props) {
  const { openAt } = useLightbox({
    images: images.map(({ fullsize, alt }) => ({ src: fullsize, alt })),
  });

  const handleClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    openAt(i);
  };

  return (
    <>
      <div
        className={clsx(styles["container--stack"], className, {
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
