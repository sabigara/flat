import type { VercelRequest, VercelResponse } from "@vercel/node";

import { getSiteMetadata } from "../src/lib/getSiteMetaData";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (typeof req.query.url !== "string") {
    return res.status(400).json({});
  }
  console.debug(isCrossOrigin(req));
  const metadata = await getSiteMetadata(req.query.url);
  res.status(200).json({
    metadata,
  });
}

function isCrossOrigin(req: VercelRequest) {
  console.debug(req.headers);
  return !req.headers.origin || req.headers.origin !== req.headers.host;
}
