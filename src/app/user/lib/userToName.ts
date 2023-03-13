import { AppBskyActorRef } from "@atproto/api";

export function userToName(user: AppBskyActorRef.WithInfo): string {
  return user.displayName || user.handle;
}
