import fs from "fs";

import { JSDOM } from "jsdom";

import type { VercelRequest, VercelResponse } from "@vercel/node";

class JsonCache<T> {
  private cache: Map<string, T>;

  constructor(private filePath: string) {
    this.cache = new Map();
    this.load();
  }

  private load() {
    if (fs.existsSync(this.filePath)) {
      const json = fs.readFileSync(this.filePath, "utf8");
      this.cache = new Map(Object.entries(JSON.parse(json)));
    }
  }

  private serialize() {
    return JSON.stringify(
      Array.from(this.cache.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {} as Record<string, T>
      )
    );
  }

  private save() {
    fs.writeFileSync(this.filePath, this.serialize());
  }

  public get(key: string): T | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: T): void {
    this.cache.set(key, value);
    this.save();
  }

  public delete(key: string): void {
    this.cache.delete(key);
    this.save();
  }
}

type Ogp = {
  type?: string;
  url?: string;
  site_name: string;
  title?: string;
  description?: string;
  image?: string;
};

type SiteMetadata = {
  ogp: Ogp;
  title?: string;
  description?: string;
  url: string;
};

const isDev = process.env.NODE_ENV === "development";
const cacheStore = isDev
  ? new JsonCache<SiteMetadata>("./site-metadata.cache.json")
  : null;

async function getSiteMetadata(url: string): Promise<SiteMetadata> {
  if (isDev) {
    const cache = cacheStore?.get(url);
    if (cache) return cache;
  }

  console.debug("fetching siteMetadata for", url);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch ${url}. Status: ${
        resp.status
      }. Body: ${await resp.text()}`
    );
  }
  const htmlStr = await resp.text();
  const dom = new JSDOM(htmlStr);
  const meta = dom.window.document.querySelectorAll("head > meta");

  const description = dom.window.document
    .querySelector("meta[name=description]")
    ?.getAttribute("content");

  const ogp = Array.from(meta)
    .filter(
      (element) =>
        element.hasAttribute("property") &&
        element.getAttribute("property")!.startsWith("og:")
    )
    .reduce((acc, ogp) => {
      const property = ogp.getAttribute("property")!.trim().replace("og:", "");
      const content = ogp.getAttribute("content");
      return {
        ...acc,
        [property]: content,
      };
    }, {} as Ogp);

  const metadata = {
    ogp,
    title: dom.window.document.title,
    description: description ?? undefined,
    url,
  };
  if (isDev) {
    cacheStore?.set(url, metadata);
  }
  return metadata;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (isDev) {
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (
    req.method !== "POST" ||
    req.headers["content-type"] !== "application/json" ||
    (!isDev && !isSameOrigin(req)) ||
    typeof req.body.url !== "string"
  ) {
    return res.status(400).json({});
  }
  const metadata = await getSiteMetadata(req.body.url);
  res.status(200).json({
    metadata,
  });
}

function isSameOrigin(req: VercelRequest) {
  if (!req.headers.origin || !req.headers.host) return false;
  const baseUrl = getBaseUrl(req);
  return req.headers.origin === baseUrl + req.headers.host;
}

function getBaseUrl(req: VercelRequest) {
  const scheme = process.env.NODE_ENV === "development" ? "http" : "https";
  return scheme + "://" + req.headers.host;
}
