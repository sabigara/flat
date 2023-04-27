import {
  RichText,
  AppBskyFeedDefs,
  AtpAgent,
  AppBskyActorDefs,
} from "@atproto/api";
import { type BlobRef } from "@atproto/lexicon";

import { compressImage } from "@/src/app/content/image/lib/compressImage";
import { uploadImage } from "@/src/app/content/image/lib/uploadImage";
import { embedExternal } from "@/src/app/post/lib/embedExternal";
import { embedImages } from "@/src/app/post/lib/embedImages";
import { embedRecord } from "@/src/app/post/lib/embedRecord";
import { postToReply } from "@/src/app/post/lib/postToReply";
import { bsky } from "@/src/lib/atp";
import { SiteMetadata } from "@/src/lib/siteMetadata";

type Params = {
  myProfile: AppBskyActorDefs.ProfileViewDetailed;
  text: string;
  images: File[];
  external?: SiteMetadata;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
  atp: AtpAgent;
};

export async function createPostWithEmbed({
  myProfile,
  text,
  images,
  external,
  replyTarget,
  quoteTarget,
  atp,
}: Params) {
  const richText = new RichText({ text });
  await richText.detectFacets(atp);
  return bsky.feed.post.create(
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
    return embedRecord(quoteTarget);
  } else if (external) {
    return embedExternal(external);
  } else if (images.length) {
    const res = await uploadImageBulk(images);
    return res.length ? embedImages(res) : undefined;
  } else {
    return undefined;
  }
}

const uploadImageBulk = async (images: File[]) => {
  const results: { blobRef: BlobRef }[] = [];
  for (const img of images) {
    if (!img) continue;
    const res = await uploadImage(await compressImage(img));
    results.push(res);
  }
  return results;
};
