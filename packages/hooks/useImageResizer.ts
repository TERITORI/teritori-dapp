import { useEffect, useState, useCallback } from "react";
import { Image } from "react-native";

interface Props {
  image: string | undefined;
  maxSize: { width?: number; height?: number };
}

export const useImageResizer = ({ image, maxSize }: Props) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const updateSize = useCallback(
    (width: number, height: number) => {
      const aspectRatio = width / height;
      if (maxSize.height) {
        setSize({
          width: maxSize.height * aspectRatio,
          height: maxSize.height,
        });
      } else if (maxSize.width) {
        setSize({
          height: maxSize.width / aspectRatio,
          width: maxSize.width,
        });
      }
    },
    [maxSize.height, maxSize.width]
  );
  useEffect(() => {
    if (!image) {
      return;
    }

    if (typeof image === "number") {
      const { height, width } = Image.resolveAssetSource(image);
      updateSize(width, height);
    } else {
      Image.getSize(image, (width, height) => {
        updateSize(width, height);
      });
    }
  }, [maxSize.width, maxSize.height, image, updateSize]);

  return size;
};
