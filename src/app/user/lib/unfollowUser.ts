import { AtUri } from "@atproto/uri";

import { bsky } from "@/src/lib/atp";

export function unfollowUser({ uri }: { uri: string }) {
  const { host, rkey } = new AtUri(uri);
  return bsky.graph.follow.delete({
    did: host,
    rkey: rkey,
  });
}
