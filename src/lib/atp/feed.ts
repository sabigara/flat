import {
  AppBskyEmbedImages,
  AppBskyFeedFeedViewPost,
  AppBskyFeedPost,
} from "@atproto/api";
import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { find } from "linkifyjs";

// TODO: Support mention
// `linkify-plugin-mention` doesn't support usernames that include dots
export function postTextToEntities(text: string): AppBskyFeedPost.Entity[] {
  const urls = find(text, "url");
  return urls.map((url) => ({
    type: "link",
    index: {
      start: url.start,
      end: url.end,
    },
    value: url.href,
  }));
}

export function cidsToEmbedImages(imgCids: string[]): AppBskyEmbedImages.Main {
  return {
    $type: "app.bsky.embed.images",
    images: imgCids.map((cid) => ({
      alt: "",
      image: {
        cid,
        mimeType: "image/jpeg",
      },
    })),
  };
}

export function postToReply(
  replyTarget: AppBskyFeedFeedViewPost.Main
): ReplyRef {
  const parent = { cid: replyTarget.post.cid, uri: replyTarget.post.uri };
  const root = replyTarget.reply?.root ? replyTarget.reply.root : parent;
  return {
    handle: replyTarget.post.author.handle,
    parent,
    root,
  };
}
