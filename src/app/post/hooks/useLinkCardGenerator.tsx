import { RichText } from "@atproto/api";
import React from "react";

import { PostLinkCardGenerator } from "@/src/app/post/components/PostLinkCardGenerator";
import EmbeddedExternal from "@/src/app/post/components/embed/EmbeddedExternal";
import { EmbeddedExternalSkelton } from "@/src/app/post/components/embed/EmbeddedExternalSkelton";
import { useSiteMetadata } from "@/src/app/post/hooks/useSiteMetadata";

type Params = {
  rt: RichText;
  classNames?: {
    data?: string;
    skelton?: string;
    generator?: string;
  };
};

export function useLinkCardGenerator({ rt, classNames }: Params) {
  const [selectedUri, setSelectedUri] = React.useState("");
  const { data: siteMetadata, isFetching } = useSiteMetadata(selectedUri);

  const preview = (() => {
    if (!selectedUri) return null;
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
      selected={selectedUri}
      setSelected={setSelectedUri}
      className={classNames?.generator}
    />
  );
  return {
    preview,
    generator,
    selectedUri,
    setSelectedUri,
  };
}
