import GLightbox from "glightbox";
import React from "react";

type Params = {
  images: {
    src: string;
    alt?: string;
  }[];
};

export function useLightbox({ images }: Params) {
  // TODO: is this expensive? consider moving to inside useEffect.
  const gl = React.useMemo(
    () =>
      GLightbox({
        elements: images.map(({ src, alt }) => ({
          href: src,
          alt,
          type: "image",
        })),
      }),
    [images]
  );

  const openAt = (i: number) => {
    gl.openAt(i);
  };

  return { openAt };
}
