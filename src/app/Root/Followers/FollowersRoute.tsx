import { useParams } from "react-router-dom";

import { UserList, UserListQueryFn } from "@/src/components/user/UserList";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

import styles from "./FollowersRoute.module.scss";

export function FollowersRoute() {
  const params = useParams();
  const handle = params.handle;
  // TODO: handle invalid state
  if (!handle) return null;
  const queryKey = queryKeys.users.followers.$({ user: handle });
  const queryFn: UserListQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.graph.getFollowers({
      user: handle,
      limit: 25,
      ...(pageParam ? { before: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return {
      users: resp.data.followers,
      cursor: resp.data.cursor,
    };
  };
  return (
    <>
      <h1 className={styles.title}>@{handle} のフォロワー</h1>
      <UserList queryKey={queryKey} queryFn={queryFn} className={styles.list} />
    </>
  );
}
