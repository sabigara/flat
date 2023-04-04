import { AppBskyFeedDefs } from "@atproto/api";
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
        quoteTarget: undefined,
      });
    },
    handleClickReply: (feedItem: AppBskyFeedDefs.FeedViewPost) => {
      setComposer({
        open: true,
        replyTarget: feedItem,
      });
    },
    handleClickQuote: (feedItem: AppBskyFeedDefs.PostView) => {
      setComposer({
        open: true,
        quoteTarget: feedItem,
      });
    },
  };
}
