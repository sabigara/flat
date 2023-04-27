import { RichText, RichTextSegment } from "@atproto/api";
import clsx from "clsx";
import React from "react";

import { shortenUrl } from "@/src/lib/string";

import styles from "./PostLinkCardGenerator.module.scss";

type Props = {
  rt: RichText;
  selected: string;
  onChange: (val: string) => void;
  className?: string;
};

export function PostLinkCardGenerator({
  rt,
  selected,
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
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {links.map((seg) => {
          if (!seg.link || !seg.facet) return null;
          return (
            <GenLinkCardButton
              key={seg.facet.index.byteStart + seg.facet.index.byteEnd} // TODO: possibly not unique
              uri={seg.link.uri}
              selected={selected === seg.link.uri}
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
  onClick,
}: {
  uri: string;
  selected?: boolean;
  onClick?: (uri: string) => void;
}): React.ReactElement {
  return (
    <button
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} link card for: ${uri}`}
      onClick={() => void onClick?.(uri)}
      className={styles.button}
    >
      <span aria-hidden className={styles.button__plus}>
        +
      </span>
      <span aria-hidden>{shortenUrl(uri, 22)}</span>
    </button>
  );
}
