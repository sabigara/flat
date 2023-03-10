import { AtUri } from "@atproto/uri";

import { bsky } from "@/src/lib/atp/atp";

export async function followUser({
  did,
  subject,
}: {
  did: string;
  subject: { did: string; declarationCid: string };
}) {
  return bsky.graph.follow.create(
    { did },
    {
      subject,
      createdAt: new Date().toISOString(),
    }
  );
}

export function unfollowUser({ uri }: { uri: string }) {
  const { host, rkey } = new AtUri(uri);
  return bsky.graph.follow.delete({
    did: host,
    rkey: rkey,
  });
}
