import React from "react";
import { useOutletContext } from "react-router-dom";

import { RootContext } from "@/src/app/Root/Layout";
import { Feed, FeedQueryFn } from "@/src/components/Feed";
import PostComposer from "@/src/components/post/PostComposer";
import { bsky } from "@/src/lib/atp/atp";
import { feedItemToUniqueKey } from "@/src/lib/post";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

export function RootRoute() {
  const { myProfile, composer } = useOutletContext<RootContext>();
  const queryKey = queryKeys.feed.home.$;
  const queryFn: FeedQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.feed.getTimeline({
      limit: 25,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { before: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const fetchLatest = React.useCallback(
    async () => (await bsky.feed.getTimeline({ limit: 1 })).data.feed[0],
    []
  );
  return (
    <>
      <PostComposer
        myProfile={myProfile}
        open={composer.open}
        setOpen={composer.setOpen}
        onClickCompose={composer.handleClickCompose}
        replyTarget={composer.replyTarget}
        // keep it's internal state until replyTarget changes or removed.
        key={composer.replyTarget && feedItemToUniqueKey(composer.replyTarget)}
      />
      <Feed
        queryKey={queryKey}
        queryFn={queryFn}
        fetchLatestOne={fetchLatest}
        onClickReply={composer.handleClickReply}
      />
    </>
  );
}
