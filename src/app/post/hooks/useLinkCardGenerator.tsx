import { RichText } from "@atproto/api";
import { useAtom } from "jotai";

import { PostLinkCardGenerator } from "@/src/app/post/components/PostLinkCardGenerator";
import EmbeddedExternal from "@/src/app/post/components/embed/EmbeddedExternal";
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

  const preview = (() => {
    if (!linkCardUri) return null;
    if (isFetching)
      return <EmbeddedExternalSkelton className={classNames?.skelton} />;
    if (!siteMetadata) return <span>Error</span>;
    return (
      <EmbeddedExternal
        external={{
          uri: siteMetadata.url,
          title: siteMetadata.ogp.title ?? siteMetadata.title ?? "",
          description:
            siteMetadata.ogp.description ?? siteMetadata.description ?? "",
          thumb: siteMetadata.ogp.image,
        }}
        className={classNames?.data}
      />
    );
  })();
  const generator = (
    <PostLinkCardGenerator
      rt={rt}
      selected={linkCardUri ?? ""}
      onChange={setLinkCardUri}
      className={classNames?.generator}
    />
  );
  return {
    preview,
    generator,
    selectedUri: linkCardUri,
  };
}
