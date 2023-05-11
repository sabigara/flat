type Dimensions2D = {
  width: number;
  height: number;
};

export function limitDimensions({
  width,
  height,
  maxArea,
}: Dimensions2D & {
  maxArea: number;
}): Dimensions2D & { scale: number } {
  const aspectRatio = width / height;

  if (width * height <= maxArea) {
    return { width, height, scale: 1 };
  }

  const limitedHeight = Math.floor(Math.sqrt(maxArea / aspectRatio));
  const limitedWidth = Math.floor(limitedHeight * aspectRatio);

  return {
    width: limitedWidth,
    height: limitedHeight,
    scale: limitedWidth / width,
  };
}
