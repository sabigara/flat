import { RichText, RichTextProps, RichTextSegment } from "@atproto/api";
import React from "react";
import { Link } from "react-router-dom";

import Prose from "@/src/components/Prose";
import { truncate } from "@/src/lib/string";

type Props = RichTextProps & {
  className?: string;
};

export function RichTextRenderer({ text, facets, className }: Props) {
  const content = React.useMemo(() => {
    let rt: RichText;
    try {
      rt = new RichText({ text, facets });
    } catch (e) {
      console.error(e);
      return <span>Could&apos;nt parse RichText</span>;
    }
    return (
      <>
        {Array.from(rt.segments()).map((seg) => (
          <SegmentToElement
            key={
              seg.facet
                ? `${seg.facet.index.byteStart}-${seg.facet.index.byteEnd}`
                : seg.text // FIXME: whitespace are easily duplicated
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
      >
        {/* Strip URL scheme and truncate */}
        {truncate(segment.text.replace(/^.*:\/\//, ""), { max: 28 })}
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
