import { AtUri } from "@atproto/uri";

export const buildPostUrl = (params: { handle: string; uri: string }) =>
  `/${params.handle}/posts/${new AtUri(params.uri).rkey}`;
