import ImageBlobReduce from "image-blob-reduce";

import { atp } from "@/src/lib/atp/atp";

const imgReduce = ImageBlobReduce({});

export async function uploadImage(file: File) {
  const imgBlob = await imgReduce.toBlob(file, {
    max: 1000,
  });
  const resp = await atp.api.com.atproto.blob.upload(
    new Uint8Array(await imgBlob.arrayBuffer()),
    {
      encoding: "image/jpeg",
    }
  );
  if (!resp.success) throw new Error("Failed to upload image");
  return resp.data.cid;
}
