export type SiteMetadata = {
  ogp: Ogp;
  title?: string;
  description?: string;
  url: string;
};

export type Ogp = {
  type?: string;
  url?: string;
  site_name: string;
  title?: string;
  description?: string;
  image?: string;
};

export async function fetchSiteMetadata(url: string) {
  const resp = await fetch(
    import.meta.env.VITE_SITE_METADATA_API_BASE_URL + "/api/siteMetadata",
    {
      method: "POST",
      headers: {
        ["content-type"]: "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );
  if (!resp.ok) throw new Error(`Couldn't fetch site metadata for: ${url}`);
  return (await resp.json()).metadata as SiteMetadata; // TODO: validation
}
