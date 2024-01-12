import { AppBskyEmbedImages, AppBskyFeedDefs } from "@atproto/api";
import { useTranslation } from "react-i18next";
import { BiSolidCopy } from "react-icons/bi";

import { useLightbox } from "@/src/app/content/image/hooks/useLightbox";

import styles from "./MediaFeedRenderer.module.scss";

type Props = {
  items: AppBskyFeedDefs.FeedViewPost[];
};

export default function MediaFeedRenderer({ items }: Props) {
  return (
    <div className={styles.container}>
      {items.map((item) =>
        AppBskyEmbedImages.isView(item.post.embed) ? (
          <Item
            post={item.post}
            images={item.post.embed.images}
            key={item.post.cid}
          />
        ) : null,
      )}
    </div>
  );
}

type ItemProps = {
  post: AppBskyFeedDefs.PostView;
  images: AppBskyEmbedImages.ViewImage[];
};

function Item({ images }: ItemProps) {
  const { t } = useTranslation("common");
  const { openAt } = useLightbox({
    images: images.map(({ fullsize, alt }) => ({ src: fullsize, alt })),
  });

  const handleClick = () => {
    openAt(0);
  };

  const firstImage = images[0];

  return (
    <button className={styles.item} onClick={handleClick}>
      <img src={firstImage.thumb} alt={firstImage.alt} className={styles.img} />
      {images.length > 1 && (
        <BiSolidCopy
          className={styles.multiple}
          title={t("post.embedded.image-count", { count: images.length - 1 })}
        />
      )}
    </button>
  );
}
