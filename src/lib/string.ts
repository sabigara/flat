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

export function shortenUrl(url: string, max = 28) {
  return truncate(url.replace(/^.*:\/\//, ""), { max });
}
