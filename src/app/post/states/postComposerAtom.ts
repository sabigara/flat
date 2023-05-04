import { AppBskyFeedDefs } from "@atproto/api";
import { atomWithImmer } from "jotai-immer";

export type SelectedImage = {
  dataURL?: string;
  file?: File;
  alt?: string;
};

type PostComposerAtom = {
  open: boolean;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
  linkCardUri?: string;
  images: SelectedImage[];
};

export const postComposerAtom = atomWithImmer<PostComposerAtom>({
  open: false,
  replyTarget: undefined,
  quoteTarget: undefined,
  linkCardUri: undefined,
  images: [],
});
