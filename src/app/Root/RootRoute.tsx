import { RootContext } from "@/src/app/Root/Layout";
import { Feed, FeedQueryFn } from "@/src/components/Feed";
import PostComposer from "@/src/components/PostComposer";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries";
import React from "react";
import { useOutletContext } from "react-router-dom";

export function RootRoute() {
  const { profile, composer } = useOutletContext<RootContext>();
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
        profile={profile}
        open={composer.open}
        setOpen={composer.handleOpen}
        replyTarget={composer.replyTarget}
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
