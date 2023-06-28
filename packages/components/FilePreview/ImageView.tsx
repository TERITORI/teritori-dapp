import React, { useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  View,
} from "react-native";

import { DeleteButton } from "./DeleteButton";
import { ImagesFullViewModal } from "./ImagesFullViewModal";
import { ipfsURLToHTTPURL } from "./ipfs";
import { errorColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/feed";
import { BrandText } from "../BrandText";

interface ImagePreviewProps {
  files: LocalFileData[] | RemoteFileData[];
  imageStyle?: StyleProp<ImageStyle>;
}

export const ImageView: React.FC<ImagePreviewProps> = ({
  files,
  imageStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullView, setFullView] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      <ImagesFullViewModal
        files={files.map((file) => file.url)}
        activeIndex={activeIndex}
        isVisible={isFullView}
        onClose={() => setFullView(false)}
      />

      {files.map((file, index) => {
        if (!file?.url)
          return (
            <BrandText style={[fontSemibold13, { color: errorColor }]}>
              Image not found
            </BrandText>
          );
        return (
          <TouchableOpacity
            onPress={() => {
              setActiveIndex(index);
              setFullView(true);
            }}
            key={file.fileName}
            style={{
              padding: layout.padding_x1,
            }}
          >
            <Image
              source={{ uri: file.url }}
              resizeMode="contain"
              style={[
                {
                  height: 100,
                  width: 100,
                  borderRadius: 4,
                },
                imageStyle,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
