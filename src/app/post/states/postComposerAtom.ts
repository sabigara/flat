import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { atom } from "jotai";

type PostComposerAtom = {
  open: boolean;
  replyTarget?: AppBskyFeedFeedViewPost.Main;
};

export const postComposerAtom = atom<PostComposerAtom>({
  open: false,
  replyTarget: undefined,
});
