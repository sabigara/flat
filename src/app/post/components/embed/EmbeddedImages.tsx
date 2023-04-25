import { AppBskyEmbedImages } from "@atproto/api";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import React from "react";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { useLightbox } from "@/src/app/content/image/hooks/useLightbox";

import "glightbox/dist/css/glightbox.min.css";
import styles from "./EmbeddedImages.module.scss";

type Props = {
  images: AppBskyEmbedImages.ViewImage[];
  className?: string;
};

export default function EmbeddedImages({ images, className }: Props) {
  const { postImageLayout } = useAtomValue(settingsAtom);
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
        className={clsx(styles[`container--${postImageLayout}`], className, {
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
