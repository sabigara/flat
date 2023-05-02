import { AtpAgent } from "@atproto/api";

type Params = {
  service: string;
  identifier: string;
};

export async function getRepoDescription({ service, identifier }: Params) {
  const resp = await new AtpAgent({ service }).com.atproto.repo.describeRepo({
    repo: identifier,
  });
  return resp.data;
}
