import { RichText } from "@atproto/api";
import { Tag } from "@camome/core/Tag";
import { useAtom } from "jotai";

import {
  PostLinkCardGenerator,
  PostLinkCardPreview,
} from "@/src/app/post/components/PostLinkCardGenerator";
import { EmbeddedExternalSkelton } from "@/src/app/post/components/embed/EmbeddedExternalSkelton";
import { useSiteMetadata } from "@/src/app/post/hooks/useSiteMetadata";
import { postComposerAtom } from "@/src/app/post/states/postComposerAtom";
import { SiteMetadata } from "@/src/lib/siteMetadata";

type Params = {
  rt: RichText;
  onSuccess?: (data: SiteMetadata, uri: string) => void;
  classNames?: {
    data?: string;
    skelton?: string;
    error?: string;
    generator?: string;
  };
};

// TODO: merge with usePostComposer?
export function useLinkCardGenerator({ rt, onSuccess, classNames }: Params) {
  const [composer, setComposer] = useAtom(postComposerAtom);
  const { linkCardUri } = composer;
  const { data: siteMetadata, isFetching } = useSiteMetadata({
    uri: linkCardUri ?? "",
    onSuccess: (data) => {
      onSuccess?.(data, linkCardUri ?? "");
    },
  });

  const setLinkCardUri = (uri: string) => {
    setComposer((curr) => ({
      ...curr,
      linkCardUri: curr.linkCardUri === uri ? undefined : uri,
    }));
  };

  const handleClickRemove = () => {
    setLinkCardUri("");
  };

  const preview = (() => {
    if (!linkCardUri) return null;
    if (isFetching)
      return <EmbeddedExternalSkelton className={classNames?.skelton} />;
    if (!siteMetadata)
      return (
        <Tag size="sm" colorScheme="danger" className={classNames?.error}>
          Error: Failed to fetch link card data.
        </Tag>
      );
    return (
      <PostLinkCardPreview
        siteMetadata={siteMetadata}
        onClickRemove={handleClickRemove}
        className={classNames?.data}
      />
    );
  })();
  const generator = (
    <PostLinkCardGenerator
      rt={rt}
      selected={linkCardUri ?? ""}
      loading={isFetching}
      onChange={setLinkCardUri}
      className={classNames?.generator}
    />
  );
  return {
    preview,
    generator,
    selectedUri: linkCardUri,
    siteMetadata,
  };
}
