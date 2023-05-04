import { RichText, AppBskyFeedDefs, AppBskyActorDefs } from "@atproto/api";
import { type BlobRef } from "@atproto/lexicon";

import { getAtpAgent, getBskyApi } from "@/src/app/account/states/atp";
import { compressImage } from "@/src/app/content/image/lib/compressImage";
import { uploadImage } from "@/src/app/content/image/lib/uploadImage";
import { embedExternal } from "@/src/app/post/lib/embedExternal";
import { embedImages } from "@/src/app/post/lib/embedImages";
import { embedRecord } from "@/src/app/post/lib/embedRecord";
import { embedRecordWithExternal } from "@/src/app/post/lib/embedRecordWithExternal";
import { embedRecordWithImages } from "@/src/app/post/lib/embedRecordWithImages";
import { postToReply } from "@/src/app/post/lib/postToReply";
import { SiteMetadata } from "@/src/lib/siteMetadata";

type Params = {
  myProfile: AppBskyActorDefs.ProfileViewDetailed;
  text: string;
  images: { file: File; alt?: string }[];
  external?: SiteMetadata;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
};

export async function createPostWithEmbed({
  myProfile,
  text,
  images,
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
      embed: await getEmbed({ images, external, quoteTarget }),
      createdAt: new Date().toISOString(),
    }
  );
}

async function getEmbed({
  images,
  external,
  quoteTarget,
}: Pick<Params, "images" | "external" | "quoteTarget">) {
  if (quoteTarget) {
    // images wins over external
    if (images.length) {
      return uploadAndEmbedRecordWithImages(quoteTarget, images);
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
    return uploadAndEmbedImages(images);
  } else if (external) {
    return embedExternal(external);
  } else {
    return undefined;
  }
}

const uploadAndEmbedImages = async (images: { file: File; alt?: string }[]) => {
  const res = await uploadImageBulk(images);
  return res.length ? embedImages(res) : undefined;
};

const uploadAndEmbedRecordWithImages = async (
  record: AppBskyFeedDefs.PostView,
  images: { file: File; alt?: string }[]
) => {
  const res = await uploadImageBulk(images);
  return res.length
    ? embedRecordWithImages({
        record,
        images: res,
      })
    : undefined;
};

const uploadImageBulk = async (images: { file: File; alt?: string }[]) => {
  const results: { blobRef: BlobRef; alt?: string }[] = [];
  for (const img of images) {
    if (!img) continue;
    const res = await uploadImage(await compressImage(img.file));
    results.push({ blobRef: res.blobRef, alt: img.alt });
  }
  return results;
};
