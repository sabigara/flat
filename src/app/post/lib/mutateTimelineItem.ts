import { AppBskyFeedGetTimeline, AppBskyFeedDefs } from "@atproto/api";
import { InfiniteData } from "@tanstack/react-query";
import produce, { Draft } from "immer";

export type TimelineInfiniteData =
  InfiniteData<AppBskyFeedGetTimeline.OutputSchema>;

export function mutateTimelineItem(
  data: TimelineInfiniteData | undefined,
  postUri: string,
  fn: (draft: Draft<AppBskyFeedDefs.PostView>) => void
) {
  if (!data) return { pageParams: [], pages: [] };
  return produce(data, (draft) => {
    const target = draft.pages
      .flatMap((p) => p.feed)
      .find((item) => item.post.uri === postUri);
    if (!target) return data;
    fn(target.post);
  });
}
