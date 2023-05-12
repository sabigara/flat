import { RichText } from "@atproto/api";
import { LoaderFunction } from "react-router-dom";

import { getAtpAgent } from "@/src/app/account/states/atp";
import { DefaultErrorBoundary } from "@/src/app/error/components/DefaultErrorBoundary";
import { queryClient } from "@/src/app/root/lib/queryClient";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { fetchProfile } from "@/src/app/user/hooks/useProfileQuery";
import { ProfileRoute } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

// TODO: handle not found
export const loader = (async ({ params }) => {
  if (!params.handle) {
    throw new Error("Invalid params");
  }
  // TODO: Cache is empty if the query is still loading.
  const profile = await queryClient.fetchQuery({
    queryKey: queryKeys.users.single.$({ identifier: params.handle }),
    queryFn: fetchProfile,
    staleTime: 60 * 60 * 24 * 1000,
    cacheTime: 60 * 60 * 24 * 1000,
  });

  if (!profile) {
    throw new Response("Not found", { status: 404 });
  }

  const richText = new RichText({ text: profile.description ?? "" });
  await richText.detectFacets(getAtpAgent());
  return { profile, richText };
}) satisfies LoaderFunction;

export type ProfileRouteLoaderResult = Awaited<ReturnType<typeof loader>>;

export const element = <ProfileRoute />;
export const errorElement = <DefaultErrorBoundary />;
