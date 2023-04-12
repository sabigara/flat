import { QueryClient, QueryKey } from "@tanstack/react-query";

export function reloadTimelineForNewPosts(
  queryClient: QueryClient,
  queryKey: QueryKey
) {
  // must scroll to top to prevent refetch at the bottom.
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  const refetchOnTop = () => {
    if (window.scrollY !== 0) {
      window.requestAnimationFrame(refetchOnTop);
      return;
    }
    // 1. remove all the pages except for the first.
    // 2. refetch the first page.
    queryClient.setQueryData(queryKey, (data: any) => ({
      pages: data.pages.slice(0, 1),
      pageParams: data.pageParams.slice(0, 1),
    }));
    queryClient.invalidateQueries(queryKey);
  };
  window.requestAnimationFrame(refetchOnTop);
}
