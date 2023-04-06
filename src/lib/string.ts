type TruncateOptions = {
  max: number;
  ellipsis?: boolean;
};

export function truncate(
  postText: string,
  { max, ellipsis = true }: TruncateOptions
) {
  return (
    postText.slice(0, max) + (postText.length > max && ellipsis ? "…" : "")
  );
}
