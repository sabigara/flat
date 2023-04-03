import { AppBskyActorDefs } from "@atproto/api";

export function userToName(user: AppBskyActorDefs.ProfileViewDetailed): string {
  return user.displayName || user.handle;
}
