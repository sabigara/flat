import { useParams } from "react-router-dom";

import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import { UserList, UserListQueryFn } from "@/src/app/user/components/UserList";
import { bsky } from "@/src/lib/atp";

import styles from "./FollowingRoute.module.scss";

export function FollowingRoute() {
  const params = useParams();
  const handle = params.handle;
  // TODO: handle invalid state
  if (!handle) return null;
  const queryKey = queryKeys.users.following.$({ user: handle });
  const queryFn: UserListQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.graph.getFollows({
      actor: handle,
      limit: 25,
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return {
      users: resp.data.follows,
      cursor: resp.data.cursor,
    };
  };
  const title = `@${handle} がフォロー中`;
  return (
    <>
      <Seo title={title} />
      <h1 className={styles.title}>{title}</h1>
      <UserList queryKey={queryKey} queryFn={queryFn} className={styles.list} />
    </>
  );
}
