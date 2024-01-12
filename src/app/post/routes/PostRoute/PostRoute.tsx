import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useParams } from "react-router-dom";

import { NotFoundErrorComponent } from "@/src/app/error/components/NotFoundErrorComponent";
import { FeedSkelton } from "@/src/app/feed/components/FeedSkelton";
import Thread from "@/src/app/post/components/Thread";
import PostComposer from "@/src/app/post/components/composer/PostComposer";
import { usePostThreadQuery } from "@/src/app/post/hooks/usePostThreadQuery";
import { findPostFromThread } from "@/src/app/post/lib/findPostFromThread";
import { MutatePostCache } from "@/src/app/post/lib/types";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import { useProfileQuery } from "@/src/app/user/hooks/useProfileQuery";
import { userToName } from "@/src/app/user/lib/userToName";
import { truncate } from "@/src/lib/string";

import styles from "./PostRoute.module.scss";

export default function PostRoute() {
  const params = useParams();
  const { data: profile, status: profileStatus } = useProfileQuery({
    identifier: params.handle,
  });
  const threadUri =
    profile && params.rkey
      ? `at://${profile.did}/app.bsky.feed.post/${params.rkey}`
      : undefined;
  const { data: thread, status: threadStatus } = usePostThreadQuery({
    uri: threadUri,
  });
  const queryClient = useQueryClient();

  const revalidatePost = () => {
    queryClient.refetchQueries(queryKeys.posts.single.$({ uri: threadUri }));
  };

  const mutatePostCache: MutatePostCache = ({ fn, uri }) => {
    queryClient.setQueryData<AppBskyFeedDefs.ThreadViewPost>(
      queryKeys.posts.single.$({ uri: threadUri }),
      (data) => {
        if (!data) throw new Error("Shouldn't reach here");
        return produce(data, (draft) => {
          const post = findPostFromThread(draft, uri);
          if (!post) return;
          fn(post);
        });
      },
    );
  };

  const isLoading = profileStatus === "loading" || threadStatus === "loading";

  const content: React.ReactNode = (() => {
    if (isLoading) return null;
    if (!AppBskyFeedDefs.isThreadViewPost(thread)) {
      return <NotFoundErrorComponent />;
    }
    // key shouldn't be required but posts are duplicated only when transitioned by the router.
    return (
      <Thread
        thread={thread}
        isSelected
        key={thread.post.uri}
        revalidate={revalidatePost}
        mutatePostCache={mutatePostCache}
      />
    );
  })();

  const postText =
    thread && AppBskyFeedPost.isRecord(thread.post.record)
      ? thread.post.record.text
      : "";
  const titlePostText = truncate(postText, { max: 32 });

  return (
    <>
      <Seo
        title={
          thread && titlePostText
            ? // TODO: support quotation marks for non-Japanese
              `${userToName(thread.post.author)}「${titlePostText}」`
            : ""
        }
      />
      <div className={styles.container}>
        {content}
        {isLoading && <FeedSkelton count={3} />}
      </div>
      <PostComposer revalidate={revalidatePost} />
    </>
  );
}
