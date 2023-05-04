import { IconButton } from "@camome/core/IconButton";
import ReactDOM from "react-dom";
import { TbPhotoPlus, TbX } from "react-icons/tb";
import ImageUploading, { type ErrorsType } from "react-images-uploading";

import styles from "./ImagePicker.module.scss";

export type SelectedImage = {
  dataURL?: string;
  file?: File;
  alt?: string;
};

export type ImagePickerProps = {
  images: SelectedImage[];
  onChange: (images: SelectedImage[]) => void;
  onError?: (errors: ErrorsType) => void;
  max?: number;
  previewContainer: HTMLElement | null;
};

export default function ImagePicker({
  images,
  onChange,
  onError,
  max,
  previewContainer,
}: ImagePickerProps) {
  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        onError={onError}
        maxNumber={max}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div>
            <IconButton
              aria-label="画像を選択"
              style={isDragging ? { color: "red" } : undefined}
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
                  {imageList.map((image, index) => (
                    <div key={index} className={styles.preview__item}>
                      <img
                        src={image.dataURL}
                        alt="選択された画像プレビュー"
                        className={styles.preview__img}
                      />
                      <IconButton
                        aria-label="Remove"
                        variant="soft"
                        colorScheme="neutral"
                        size="sm"
                        onClick={() => onImageRemove(index)}
                        className={styles.preview__removeBtn}
                      >
                        <TbX />
                      </IconButton>
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
