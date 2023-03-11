import { IconButton } from "@camome/core/IconButton";
import ReactDOM from "react-dom";
import { TbPhotoPlus, TbX } from "react-icons/tb";
import ImageUploading from "react-images-uploading";

import styles from "./ImageUploader.module.scss";

export type SelectedImage = {
  dataURL?: string;
  file?: File;
};

type Props = {
  images: SelectedImage[];
  onChange: (images: SelectedImage[]) => void;
  max: number;
  previewContainer: HTMLElement | null;
};

export default function ImageUploader({
  images,
  onChange,
  max,
  previewContainer,
}: Props) {
  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
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
