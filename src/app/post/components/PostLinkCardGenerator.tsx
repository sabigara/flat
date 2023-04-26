import { RichText } from "@atproto/api";
import clsx from "clsx";
import React from "react";

import { shortenUrl } from "@/src/lib/string";
import { isNonNullish } from "@/src/lib/typing";

import styles from "./PostLinkCardGenerator.module.scss";

type Props = {
  rt: RichText;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
};

export function PostLinkCardGenerator({
  rt,
  selected,
  setSelected,
  className,
}: Props) {
  rt.detectFacetsWithoutResolution();

  const handleClick = (url: string) => {
    setSelected((curr) => (curr === url ? "" : url));
  };

  return (
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {Array.from(rt.segments())
          .filter((seg) => seg.isLink())
          .map((seg) => seg.link)
          .filter(isNonNullish)
          .map(({ uri }) => (
            <GenLinkCardButton
              key={uri} // TODO: possibly not unique
              uri={uri}
              selected={selected === uri}
              onClick={handleClick}
            />
          ))}
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
