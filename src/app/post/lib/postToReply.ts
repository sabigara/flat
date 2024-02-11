import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import {PostView} from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export function postToReply(
  replyTarget: AppBskyFeedDefs.FeedViewPost,
): AppBskyFeedPost.ReplyRef {
  const parent = { cid: replyTarget.post.cid, uri: replyTarget.post.uri };
  const root =
    replyTarget.reply && AppBskyFeedDefs.isPostView(replyTarget.reply.root)
      ? replyTarget.reply.root : ((replyTarget.post.record as PostView)?.reply as AppBskyFeedPost.ReplyRef).root ?? parent;
  return {
    handle: replyTarget.post.author.handle,
    parent,
    root,
  };
}
