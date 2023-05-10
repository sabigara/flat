import { IconButton } from "@camome/core/IconButton";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { TbPhotoPlus, TbX } from "react-icons/tb";
import ImageUploading, { type ErrorsType } from "react-images-uploading";

import { ImagePickerPreview } from "@/src/app/post/components/composer/ImagePickerPreview";
import {
  SelectedImageEdit,
  SelectedImage,
} from "@/src/app/post/states/postComposerAtom";

import styles from "./ImagePicker.module.scss";

export type ImagePickerProps = {
  images: SelectedImage[];
  edits: SelectedImageEdit[];
  onChange: (images: SelectedImage[]) => void;
  onRemove: (idx: number) => void;
  onClickPreview: (idx: number) => void;
  onError?: (errors: ErrorsType) => void;
  max?: number;
  previewContainer: HTMLElement | null;
};

export default function ImagePicker({
  images,
  edits,
  onChange,
  onRemove,
  onClickPreview,
  onError,
  max,
  previewContainer,
}: ImagePickerProps) {
  const { t } = useTranslation();
  const handleChange = (newImages: Partial<SelectedImage>[]) => {
    const filtered: SelectedImage[] = [];
    for (const { dataURL, file } of newImages) {
      if (!dataURL || !file) {
        throw new Error("Failed to load image");
      }
      filtered.push({ dataURL, file });
    }
    onChange(filtered);
  };

  const handleRemove = (idx: number) => {
    onRemove(idx);
  };

  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={handleChange}
        onError={onError}
        maxNumber={max}
      >
        {({ imageList, onImageUpload, dragProps }) => (
          <div>
            <IconButton
              aria-label="画像を選択"
              onClick={onImageUpload}
              variant="soft"
              size="sm"
              {...dragProps}
            >
              <TbPhotoPlus />
            </IconButton>
            {previewContainer &&
              !!imageList.length &&
              ReactDOM.createPortal(
                <div className={styles.preview__container}>
                  {imageList.map(({ dataURL }, idx) => (
                    <div key={idx} className={styles.preview__item}>
                      {dataURL && (
                        <button
                          onClick={() => void onClickPreview(idx)}
                          aria-label={t(
                            "post.composer.image-editor.crop-image-or-edit-alt"
                          )}
                        >
                          <ImagePickerPreview
                            src={dataURL}
                            crop={edits[idx]?.crop}
                            className={styles.preview__img}
                          />
                        </button>
                      )}
                      <IconButton
                        aria-label="Remove"
                        variant="soft"
                        colorScheme="neutral"
                        size="sm"
                        onClick={() => handleRemove(idx)}
                        className={styles.preview__removeBtn}
                      >
                        <TbX />
                      </IconButton>
                      <span
                        className={styles.preview__editBtn}
                        onClick={() => void onClickPreview(idx)}
                      >
                        {t("post.composer.image-editor.edit")}
                      </span>
                    </div>
                  ))}
                </div>,
                previewContainer
              )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
