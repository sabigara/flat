import { bsky } from "@/src/lib/atp";

export async function followUser({ repo, did }: { repo: string; did: string }) {
  return bsky.graph.follow.create(
    { repo },
    {
      subject: did,
      createdAt: new Date().toISOString(),
    }
  );
}
