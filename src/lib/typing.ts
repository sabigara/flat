export function isNonNullish<T>(
  something: T,
): something is Exclude<T, undefined | null> {
  return something != null;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
