import { AtUri } from "@atproto/uri";

import { getBskyApi } from "@/src/app/account/states/atp";

export function unfollowUser({ uri }: { uri: string }) {
  const { host, rkey } = new AtUri(uri);
  return getBskyApi().graph.follow.delete({
    repo: host,
    rkey: rkey,
  });
}
