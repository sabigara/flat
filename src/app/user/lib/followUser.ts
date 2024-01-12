import { getBskyApi } from "@/src/app/account/states/atp";

export async function followUser({ repo, did }: { repo: string; did: string }) {
  return getBskyApi().graph.follow.create(
    { repo },
    {
      subject: did,
      createdAt: new Date().toISOString(),
    },
  );
}
