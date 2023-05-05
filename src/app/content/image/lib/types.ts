import { PixelCrop } from "react-image-crop";

export type Crop = PixelCrop & {
  rendered: {
    width: number;
    height: number;
  };
};
