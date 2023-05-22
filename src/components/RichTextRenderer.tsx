import { RichText, RichTextProps, RichTextSegment } from "@atproto/api";
import { Tag } from "@camome/core/Tag";
import React from "react";
import { Link } from "react-router-dom";

import Prose from "@/src/components/Prose";
import { shortenUrl } from "@/src/lib/string";

type Props = RichTextProps & {
  className?: string;
};

export function RichTextRenderer({ text, facets, className }: Props) {
  const content = React.useMemo(() => {
    let rt: RichText;
    try {
      rt = new RichText({
        text,
        facets:
          // Avoid the following error that's thrown by facets.sort():
          //  `Cannot assign to read only property '0' of object '[object Array]'`
          // Not sure why but it's immutable?
          [...(facets ? facets : [])],
      });
    } catch (e) {
      console.error(e);
      return (
        <Tag colorScheme="danger" size="sm">
          Error: Could&apos;nt parse RichText
        </Tag>
      );
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
        {shortenUrl(segment.text)}
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
