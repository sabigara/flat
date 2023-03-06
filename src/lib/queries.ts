export const queryKeys = {
  feed: {
    home: ["feed"] as const,
    author: (handle: string) => ["feed", { authorId: handle }] as const,
  },
};
