import React from "react";

import { drawImageToCanvas } from "@/src/app/content/image/lib/drawImageToCanvas";
import { Crop } from "@/src/app/content/image/lib/types";

type Props = {
  src: string;
  crop?: Crop;
  className?: string;
};

export function ImagePickerPreview({ src, crop, className }: Props) {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!canvas) return;
    drawImageToCanvas({
      src,
      crop,
      canvas,
    });
  }, [canvas, crop, src]);

  return <canvas ref={setCanvas} className={className} />;
}
