import {
  AppBskyFeedDefs,
  AppBskyFeedPost,
  ComAtprotoRepoStrongRef,
} from "@atproto/api";

type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
type ReplyRef = AppBskyFeedPost.ReplyRef;
type StrongRef = ComAtprotoRepoStrongRef.Main;

const isPostRecord = AppBskyFeedPost.isRecord;
const isPostView = AppBskyFeedDefs.isPostView;

export function postToReply(replyTarget: FeedViewPost): ReplyRef {
  const parent: StrongRef = {
    cid: replyTarget.post.cid,
    uri: replyTarget.post.uri,
  };

  const root: StrongRef = (() => {
    if (replyTarget.reply && isPostView(replyTarget.reply.root)) {
      return replyTarget.reply.root;
    } else if (
        isPostRecord(replyTarget.post.record) &&
        replyTarget.post.record.reply
    ) {
      return replyTarget.post.record.reply.root;
    } else {
      return parent;
    }
  })();

  return {
    parent,
    root,
  };
}