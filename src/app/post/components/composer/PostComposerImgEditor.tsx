import { Button } from "@camome/core/Button";
import { IconButton } from "@camome/core/IconButton";
import { Textarea } from "@camome/core/Textarea";
import React from "react";
import { TbArrowLeft } from "react-icons/tb";

import { SelectedImage } from "@/src/app/post/states/postComposerAtom";

import styles from "./PostComposerImgEditor.module.scss";

type Props = {
  image: SelectedImage;
  onChangeAltSubmit: (alt: string) => void;
  defaultAlt: string;
  onClose: () => void;
};

export function PostComposerImgEditor({
  image,
  onChangeAltSubmit,
  defaultAlt,
  onClose,
}: Props) {
  const [alt, setAlt] = React.useState(defaultAlt);
  const handleChangeAlt: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    setAlt(e.target.value);
  };
  const handleChangeAltSubmit = () => {
    onChangeAltSubmit(alt);
    onClose();
  };
  return (
    <div className={styles.container}>
      <div>
        <IconButton
          aria-label="back"
          size="sm"
          variant="ghost"
          colorScheme="neutral"
          onClick={onClose}
          className={styles.backBtn}
        >
          <TbArrowLeft />
        </IconButton>
      </div>
      <div className={styles.preview}>
        <img src={image.dataURL} alt={image.alt} />
      </div>
      <div className={styles.form}>
        <Textarea
          label="画像の説明文"
          rows={2}
          value={alt}
          onChange={handleChangeAlt}
        />
        <Button
          size="sm"
          className={styles.button}
          onClick={handleChangeAltSubmit}
        >
          決定
        </Button>
      </div>
    </div>
  );
}
