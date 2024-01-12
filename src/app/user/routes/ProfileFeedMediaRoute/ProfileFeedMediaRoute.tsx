import { useTranslation } from "react-i18next";

import { Feed } from "@/src/app/feed/components/Feed";
import MediaFeedRenderer from "@/src/app/feed/components/MediaFeedRenderer";
import { MediaFeedSkelton } from "@/src/app/feed/components/MediaFeedSkelton";
import Seo from "@/src/app/seo/Seo";
import { useProfileRouteMediaFeed } from "@/src/app/user/hooks/useProfileRouteMediaFeed";
import { userToName } from "@/src/app/user/lib/userToName";
import { useProfileOutletCtx } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

export function ProfileFeedMediaRoute() {
  const { t: usersT } = useTranslation("users");
  const { profile } = useProfileOutletCtx();
  const username = userToName(profile);
  const { queryKey, queryFn, fetchLatest } = useProfileRouteMediaFeed();

  return (
    <>
      <Seo
        title={usersT("profile.title", { actor: username })}
        description={profile.description}
      />
      <Feed
        queryKey={queryKey}
        queryFn={queryFn}
        fetchNewLatest={fetchLatest}
        renderItems={(items) => <MediaFeedRenderer items={items} />}
        skelton={<MediaFeedSkelton count={12} />}
        aggregateThreads={false}
        style={
          {
            ["--new-posts-btn-inset-block-start"]: "1rem",
          } as React.CSSProperties
        }
      />
    </>
  );
}
