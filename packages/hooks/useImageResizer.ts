import { useEffect, useState } from "react";
import { Image, ImageSourcePropType } from "react-native";

interface Props {
  image: ImageSourcePropType;
  maxSize: { width?: number; height?: number };
}

export const useImageResizer = ({ image, maxSize }: Props) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    Image.getSize(image as string, (width, height) => {
      const aspectRatio = width / height;
      if (maxSize.height) {
        setSize({
          width: maxSize.height * aspectRatio,
          height: maxSize.height,
        });
      } else if (maxSize.width) {
        setSize({ height: maxSize.width / aspectRatio, width: maxSize.width });
      }
    });
  }, [maxSize.width, maxSize.height]);

  return size;
};
