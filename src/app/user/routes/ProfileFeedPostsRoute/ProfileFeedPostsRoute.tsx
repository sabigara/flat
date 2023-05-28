import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { Feed } from "@/src/app/feed/components/Feed";
import Seo from "@/src/app/seo/Seo";
import { useProfileRouteFeed } from "@/src/app/user/hooks/useProfileRouteFeed";
import { userToName } from "@/src/app/user/lib/userToName";
import { useProfileOutletCtx } from "@/src/app/user/routes/ProfileRoute/ProfileRoute";

export function ProfileFeedPostsRoute() {
  const { t: usersT } = useTranslation("users");
  const { profile } = useProfileOutletCtx();
  const username = userToName(profile);
  const { inFeedThreadMode } = useAtomValue(settingsAtom);
  const { queryKey, queryFn, fetchLatest, feedFilter } = useProfileRouteFeed({
    withReply: false,
  });

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
        filter={feedFilter}
        aggregateThreads={inFeedThreadMode === "aggregate"}
        style={
          {
            ["--new-posts-btn-inset-block-start"]: "1rem",
          } as React.CSSProperties
        }
      />
    </>
  );
}
