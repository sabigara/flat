import { RichText, RichTextProps, RichTextSegment } from "@atproto/api";
import React from "react";
import { Link } from "react-router-dom";

import Prose from "@/src/components/Prose";

import styles from "./RichTextRenderer.module.scss";

type Props = RichTextProps & {
  className?: string;
};

export function RichTextRenderer({ text, facets, className }: Props) {
  const content = React.useMemo(() => {
    const rt = new RichText({ text, facets });
    return (
      <>
        {Array.from(rt.segments()).map((seg) => (
          <SegmentToElement
            key={
              seg.facet
                ? `${seg.facet.index.byteStart}-${seg.facet.index.byteEnd}`
                : seg.text
            }
            segment={seg}
          />
        ))}
      </>
    );
  }, [facets, text]);

  return <Prose className={className}>{content}</Prose>;
}

function SegmentToElement({
  segment,
}: {
  segment: RichTextSegment;
}): React.ReactElement {
  if (segment.isLink() && segment.link) {
    return (
      <a
        href={segment.link.uri}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => void e.stopPropagation()}
        className={styles.anchor}
      >
        {/* Strip URL scheme */}
        {segment.text.replace(/^.*:\/\//, "")}
      </a>
    );
  } else if (segment.isMention() && segment.mention) {
    return (
      <Link
        to={`/${segment.mention.did}`}
        onClick={(e) => void e.stopPropagation()}
      >
        {segment.text}
      </Link>
    );
  } else {
    return <>{segment.text}</>;
  }
}
