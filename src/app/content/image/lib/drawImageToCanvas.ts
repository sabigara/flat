import { Crop } from "@/src/app/content/image/lib/types";

type Params = {
  canvas?: HTMLCanvasElement;
  crop?: Crop;
  src: string;
};

export async function drawImageToCanvas({
  canvas = document.createElement("canvas"),
  crop: _crop,
  src,
}: Params) {
  const image = await loadImgSrc(src);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const crop: Crop = _crop
    ? _crop
    : {
        unit: "px",
        height: image.height,
        width: image.width,
        x: 0,
        y: 0,
        rendered: {
          height: image.height,
          width: image.width,
        },
      };

  const scaleX = image.naturalWidth / crop.rendered.width;
  const scaleY = image.naturalHeight / crop.rendered.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  return { image, canvas };
}

async function loadImgSrc(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject();
    };
  });
}
