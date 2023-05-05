import { AppBskyFeedDefs } from "@atproto/api";
import { atomWithImmer } from "jotai-immer";

import { Crop } from "@/src/app/content/image/lib/types";

export type SelectedImage = {
  file: File;
  dataURL: string;
};

export type SelectedImageEdit = {
  alt?: string;
  crop?: Crop;
};

export type PostComposerAtom = {
  open: boolean;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
  linkCardUri?: string;
  images: SelectedImage[];
  imageEdits: SelectedImageEdit[];
};

export const postComposerAtom = atomWithImmer<PostComposerAtom>({
  open: false,
  replyTarget: undefined,
  quoteTarget: undefined,
  linkCardUri: undefined,
  images: [],
  imageEdits: [],
});
