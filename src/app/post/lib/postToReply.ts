import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";

export function postToReply(
  replyTarget: AppBskyFeedDefs.FeedViewPost
): AppBskyFeedPost.ReplyRef {
  const parent = { cid: replyTarget.post.cid, uri: replyTarget.post.uri };
  const root = replyTarget.reply?.root ? replyTarget.reply.root : parent;
  return {
    handle: replyTarget.post.author.handle,
    parent,
    root,
  };
}
