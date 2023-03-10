import { useParams } from "react-router-dom";

import { UserList, UserListQueryFn } from "@/src/components/user/UserList";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

export function FollowingRoute() {
  const params = useParams();
  const handle = params.handle;
  // TODO: handle invalid state
  if (!handle) return null;
  const queryKey = queryKeys.users.following.$({ user: handle });
  const queryFn: UserListQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.graph.getFollows({
      user: handle,
      limit: 25,
      ...(pageParam ? { before: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return {
      users: resp.data.follows,
      cursor: resp.data.cursor,
    };
  };
  return (
    <>
      <UserList queryKey={queryKey} queryFn={queryFn} />
    </>
  );
}
