import { AppBskyFeedFeedViewPost, AppBskyFeedPost } from "@atproto/api";

export function postToReply(
  replyTarget: AppBskyFeedFeedViewPost.Main
): AppBskyFeedPost.ReplyRef {
  const parent = { cid: replyTarget.post.cid, uri: replyTarget.post.uri };
  const root = replyTarget.reply?.root ? replyTarget.reply.root : parent;
  return {
    handle: replyTarget.post.author.handle,
    parent,
    root,
  };
}
