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
    // find all to mutate reposts as well.
    const targets = draft.pages
      .flatMap((p) => p.feed)
      .filter((item) => item.post.uri === postUri);
    if (!targets) return data;
    targets.forEach((t) => fn(t.post));
  });
}
