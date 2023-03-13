import { bsky } from "@/src/lib/atp";

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
