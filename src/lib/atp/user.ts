import { AppBskyActorRef } from "@atproto/api";

export function toUsername(user: AppBskyActorRef.WithInfo): string {
  return user.displayName || user.handle;
}
