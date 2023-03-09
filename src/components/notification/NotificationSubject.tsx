import { AtUri } from "@atproto/uri";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries";

import styles from "./NotificationSubject.module.scss";

type Props = {
  reasonSubject: string;
};

export default function NotificationSubject({ reasonSubject }: Props) {
  const { host: user, rkey } = new AtUri(reasonSubject);
  const { data } = useQuery({
    queryKey: queryKeys.posts.single.$({
      user,
      rkey,
    }),
    async queryFn() {
      const resp = await bsky.feed.post.get({
        user,
        rkey,
      });
      return resp.value;
    },
    staleTime: 60 * 60 * 24,
    cacheTime: 60 * 60 * 24,
  });
  if (!data) return null;
  return (
    <article>
      <div>{data.text}</div>
    </article>
  );
}
