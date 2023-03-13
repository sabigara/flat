import {
  AppBskyActorProfile,
  AppBskyFeedFeedViewPost,
  AppBskyFeedPost,
} from "@atproto/api";

import { compressImage } from "@/src/app/content/image/lib/compressImage";
import { uploadImage } from "@/src/app/content/image/lib/uploadImage";
import { embedImages } from "@/src/app/post/lib/embedImages";
import { embedRecord } from "@/src/app/post/lib/embedRecord";
import { postTextToEntities } from "@/src/app/post/lib/postTextToEntities";
import { postToReply } from "@/src/app/post/lib/postToReply";
import { bsky } from "@/src/lib/atp";

type Params = {
  myProfile: AppBskyActorProfile.View;
  text: string;
  images: File[];
  replyTarget?: AppBskyFeedFeedViewPost.Main;
  quoteTarget?: AppBskyFeedPost.View;
};

export async function createPostWithEmbed({
  myProfile,
  text,
  images,
  replyTarget,
  quoteTarget,
}: Params) {
  const recordEmbed = quoteTarget ? embedRecord(quoteTarget) : undefined;
  const imgResults = images.length ? await uploadImageBulk(images) : undefined;
  const imgEmbed =
    imgResults && imgResults?.length ? embedImages(imgResults) : undefined;
  return bsky.feed.post.create(
    { did: myProfile.did },
    {
      text,
      entities: postTextToEntities(text),
      reply: replyTarget ? postToReply(replyTarget) : undefined,
      embed: recordEmbed ?? imgEmbed,
      createdAt: new Date().toISOString(),
    }
  );
}

const uploadImageBulk = async (images: File[]) => {
  const results: { cid: string; mimetype: string }[] = [];
  for (const img of images) {
    if (!img) continue;
    const res = await uploadImage(await compressImage(img));
    results.push(res);
  }
  return results;
};
