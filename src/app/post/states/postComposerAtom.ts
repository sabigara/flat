import { AppBskyFeedFeedViewPost, AppBskyFeedPost } from "@atproto/api";
import { atom } from "jotai";

type PostComposerAtom = {
  open: boolean;
  replyTarget?: AppBskyFeedFeedViewPost.Main;
  quoteTarget?: AppBskyFeedPost.View;
};

export const postComposerAtom = atom<PostComposerAtom>({
  open: false,
  replyTarget: undefined,
  quoteTarget: undefined,
});
