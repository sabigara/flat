import Compressor from "compressorjs";

export async function compressImage(file: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.7,
      error: reject,
      maxHeight: 2000,
      maxWidth: 2000,
      success: resolve,
      mimeType: "image/jpeg",
    });
  });
}
