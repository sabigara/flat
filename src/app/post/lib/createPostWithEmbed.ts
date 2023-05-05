import { RichText, AppBskyFeedDefs, AppBskyActorDefs } from "@atproto/api";
import { type BlobRef } from "@atproto/lexicon";

import { getAtpAgent, getBskyApi } from "@/src/app/account/states/atp";
import { canvasToBlob } from "@/src/app/content/image/lib/canvasToBlob";
import { compressImage } from "@/src/app/content/image/lib/compressImage";
import { drawImageToCanvas } from "@/src/app/content/image/lib/drawImageToCanvas";
import { uploadImage } from "@/src/app/content/image/lib/uploadImage";
import { embedExternal } from "@/src/app/post/lib/embedExternal";
import { embedImages } from "@/src/app/post/lib/embedImages";
import { embedRecord } from "@/src/app/post/lib/embedRecord";
import { embedRecordWithExternal } from "@/src/app/post/lib/embedRecordWithExternal";
import { embedRecordWithImages } from "@/src/app/post/lib/embedRecordWithImages";
import { postToReply } from "@/src/app/post/lib/postToReply";
import {
  SelectedImage,
  SelectedImageEdit,
} from "@/src/app/post/states/postComposerAtom";
import { SiteMetadata } from "@/src/lib/siteMetadata";

type Params = {
  myProfile: AppBskyActorDefs.ProfileViewDetailed;
  text: string;
  images: SelectedImage[];
  imageEdits: SelectedImageEdit[];
  external?: SiteMetadata;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
};

export async function createPostWithEmbed({
  myProfile,
  text,
  images,
  imageEdits,
  external,
  replyTarget,
  quoteTarget,
}: Params) {
  const richText = new RichText({ text });
  await richText.detectFacets(getAtpAgent());
  return getBskyApi().feed.post.create(
    { repo: myProfile.did },
    {
      text: richText.text,
      facets: richText.facets,
      reply: replyTarget ? postToReply(replyTarget) : undefined,
      embed: await getEmbed({
        images,
        imageEdits,
        external,
        quoteTarget,
      }),
      createdAt: new Date().toISOString(),
    }
  );
}

async function getEmbed({
  images,
  imageEdits,
  external,
  quoteTarget,
}: Pick<Params, "images" | "imageEdits" | "external" | "quoteTarget">) {
  if (quoteTarget) {
    // images wins over external
    if (images.length) {
      return uploadAndEmbedRecordWithImages(quoteTarget, images, imageEdits);
    } else if (external) {
      return embedRecordWithExternal({
        record: quoteTarget,
        external,
      });
    }
    return embedRecord(quoteTarget);
  }

  // images wins over external
  if (images.length) {
    return uploadAndEmbedImages(images, imageEdits);
  } else if (external) {
    return embedExternal(external);
  } else {
    return undefined;
  }
}

const uploadAndEmbedImages = async (
  images: SelectedImage[],
  meta: SelectedImageEdit[]
) => {
  const res = await uploadImageBulk(images, meta);
  return res.length ? embedImages(res) : undefined;
};

const uploadAndEmbedRecordWithImages = async (
  record: AppBskyFeedDefs.PostView,
  images: SelectedImage[],
  meta: SelectedImageEdit[]
) => {
  const res = await uploadImageBulk(images, meta);
  return res.length
    ? embedRecordWithImages({
        record,
        images: res,
      })
    : undefined;
};

const uploadImageBulk = async (
  images: SelectedImage[],
  meta: SelectedImageEdit[]
) => {
  const results: { blobRef: BlobRef; alt?: string }[] = [];
  for (const [i, img] of images.entries()) {
    const m = meta[i];
    const blob = await canvasToBlob(
      await drawImageToCanvas({ src: img.dataURL, crop: m.crop })
    );
    const res = await uploadImage(await compressImage(blob));
    results.push({ blobRef: res.blobRef, alt: m?.alt });
  }
  return results;
};
