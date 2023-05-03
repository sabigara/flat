import { AppBskyFeedLike } from "@atproto/api";
import { useTranslation } from "react-i18next";

import { getAtpAgent, getBskyApi } from "@/src/app/account/states/atp";
import { Feed, FeedQueryFn } from "@/src/app/feed/components/Feed";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import { userToName } from "@/src/app/user/lib/userToName";
import { useProfileOutletCtx } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

export function ProfileFeedLikesRoute() {
  const { t: usersT } = useTranslation("users");
  const { profile } = useProfileOutletCtx();
  const username = userToName(profile);
  const queryKey = queryKeys.feed.author(profile.handle).likes;
  const queryFn: FeedQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const likesResp = await getAtpAgent().api.app.bsky.feed.like.list({
      cursor: pageParam?.cursor,
      repo: profile.handle,
      limit: 25,
    });
    const likeSubjects = likesResp.records
      .map((r) => r.value)
      .filter(AppBskyFeedLike.isRecord)
      .map((l) => l.subject.uri);

    if (likeSubjects.length === 0) {
      return {
        cursor: undefined,
        feed: [],
      };
    }

    const postsResp = await getBskyApi().feed.getPosts({
      uris: likeSubjects,
    });
    if (!postsResp.success) throw new Error("Fetch error");
    return {
      cursor: likesResp.cursor,
      feed: postsResp.data.posts.map((post) => ({ post })),
    };
  };

  return (
    <>
      <Seo
        title={usersT("profile.title", { actor: username })}
        description={profile.description}
      />
      <Feed queryKey={queryKey} queryFn={queryFn} noCache />
    </>
  );
}
