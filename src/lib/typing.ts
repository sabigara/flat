export function isNonNullish<T>(
  something: T
): something is Exclude<T, undefined | null> {
  return something != null;
}
