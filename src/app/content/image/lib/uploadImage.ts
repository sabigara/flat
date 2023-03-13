import { atp } from "@/src/lib/atp";

/* 
  Up to:
  - 2000x2000px 
  - 1MB
  https://github.com/bluesky-social/atproto/blob/7cc48089073aa71e139fa441c53f6141fba69936/lexicons/app/bsky/embed/images.json#L24-L26

  TODO: support alt
  TODO: it accepts image/svg+xml but fails
*/
export async function uploadImage(blob: Blob) {
  const resp = await atp.api.com.atproto.blob.upload(
    new Uint8Array(await blob.arrayBuffer()),
    {
      encoding: blob.type,
    }
  );
  if (!resp.success) throw new Error("Failed to upload image");
  return {
    cid: resp.data.cid,
    mimetype: blob.type,
  };
}
