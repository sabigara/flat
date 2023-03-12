import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { useAtom } from "jotai";

import { postComposerAtom } from "@/src/app/post/states/postComposerAtom";

export function usePostComposer() {
  const [composer, setComposer] = useAtom(postComposerAtom);
  return {
    ...composer,
    set: setComposer,
    handleClickCompose: () => {
      setComposer({
        open: true,
        replyTarget: undefined,
      });
    },
    handleClickReply: (feedItem: AppBskyFeedFeedViewPost.Main) => {
      setComposer({
        open: true,
        replyTarget: feedItem,
      });
    },
  };
}
