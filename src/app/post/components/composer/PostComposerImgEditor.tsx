import { Button } from "@camome/core/Button";
import { IconButton } from "@camome/core/IconButton";
import { Textarea } from "@camome/core/Textarea";
import React from "react";
import { useTranslation } from "react-i18next";
import { TbArrowLeft } from "react-icons/tb";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";

import {
  SelectedImage,
  SelectedImageEdit,
} from "@/src/app/post/states/postComposerAtom";

import "react-image-crop/dist/ReactCrop.css";
import styles from "./PostComposerImgEditor.module.scss";

type Props = {
  image: SelectedImage;
  onSubmit: (params: SelectedImageEdit) => void;
  defaultValues?: {
    alt?: string;
    crop?: PixelCrop;
  };
  onClose: () => void;
};

export function PostComposerImgEditor({
  image,
  onSubmit,
  defaultValues,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [crop, setCrop] = React.useState<Crop | undefined>(defaultValues?.crop);
  const [completedCrop, setCompletedCrop] = React.useState<
    PixelCrop | undefined
  >(defaultValues?.crop);

  const [alt, setAlt] = React.useState(defaultValues?.alt);
  const handleChangeAlt: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    setAlt(e.target.value);
  };

  const handleSubmit = async () => {
    if (!imgRef.current) throw new Error("");
    const rendered = {
      height: imgRef.current.height,
      width: imgRef.current.width,
    };
    onSubmit({
      alt,
      crop: completedCrop ? { ...completedCrop, rendered } : undefined,
    });
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
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          ruleOfThirds
        >
          <img src={image.dataURL} ref={imgRef} />
        </ReactCrop>
      </div>
      <div className={styles.form}>
        <Textarea
          label="画像の説明文"
          rows={2}
          value={alt}
          onChange={handleChangeAlt}
        />
        <Button size="sm" className={styles.button} onClick={handleSubmit}>
          {t("post.composer.image-editor.save")}
        </Button>
      </div>
    </div>
  );
}
