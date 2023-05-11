import { RichText, RichTextSegment } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";

import EmbeddedExternal from "@/src/app/post/components/embed/EmbeddedExternal";
import { SiteMetadata } from "@/src/lib/siteMetadata";
import { shortenUrl } from "@/src/lib/string";

import styles from "./PostLinkCardGenerator.module.scss";

type Props = {
  rt: RichText;
  selected: string;
  loading: boolean;
  onChange: (val: string) => void;
  className?: string;
};

export function PostLinkCardGenerator({
  rt,
  selected,
  loading,
  onChange,
  className,
}: Props) {
  rt.detectFacetsWithoutResolution();

  const handleClick = (url: string) => {
    onChange(url);
  };

  const links = Array.from(rt.segments()).reduce<RichTextSegment[]>(
    (acc, seg) => {
      if (
        !seg.isLink() ||
        !seg.link ||
        acc.find((s) => s.link?.uri === seg.link?.uri)
      )
        return acc;
      return [...acc, seg];
    },
    []
  );

  if (!links.length) return null;

  return (
    <div className={clsx(styles.generator, className)}>
      <ul className={styles.generator__list}>
        {links.map((seg) => {
          if (!seg.link || !seg.facet) return null;
          return (
            <GenLinkCardButton
              key={seg.facet.index.byteStart + seg.facet.index.byteEnd}
              uri={seg.link.uri}
              selected={selected === seg.link.uri}
              loading={loading}
              onClick={handleClick}
            />
          );
        })}
      </ul>
    </div>
  );
}

function GenLinkCardButton({
  uri,
  selected,
  loading,
  onClick,
}: {
  uri: string;
  selected?: boolean;
  loading?: boolean;
  onClick?: (uri: string) => void;
}): React.ReactElement {
  return (
    <button
      aria-pressed={selected}
      // TODO: not accurate?
      aria-label={`${selected ? "Remove" : "Add"} link card for: ${uri}`}
      onClick={() => void onClick?.(uri)}
      className={styles.generator__button}
    >
      {loading ? (
        <Spinner className={styles.generator__button__spinner} />
      ) : (
        <span aria-hidden>+</span>
      )}
      <span aria-hidden>{shortenUrl(uri, 22)}</span>
    </button>
  );
}

type PostLinkCardPreviewProps = {
  siteMetadata: SiteMetadata;
  onClickRemove?: (metadata: SiteMetadata) => void;
  className?: string;
};

export function PostLinkCardPreview({
  siteMetadata,
  onClickRemove,
  className,
}: PostLinkCardPreviewProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.preview}>
      <EmbeddedExternal
        external={{
          uri: siteMetadata.url,
          title: siteMetadata.ogp.title ?? siteMetadata.title ?? "",
          description:
            siteMetadata.ogp.description ?? siteMetadata.description ?? "",
          thumb: siteMetadata.ogp.image,
        }}
        enabled={false}
        className={className}
      />
      <Button
        aria-label="Remove"
        variant="soft"
        colorScheme="neutral"
        size="sm"
        onClick={() => void onClickRemove?.(siteMetadata)}
        className={styles.preview__removeBtn}
      >
        {t("post.composer.link-card.remove")}
      </Button>
    </div>
  );
}
