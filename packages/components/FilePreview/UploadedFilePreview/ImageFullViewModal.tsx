import React, { SVGProps, useState } from "react";
import {
  Image,
  useWindowDimensions,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { neutral22, neutral33 } from "../../../utils/style/colors";
import { SVG } from "../../SVG";
import ModalBase from "../../modals/ModalBase";

interface ImageFullViewModalProps {
  files: string[];
  isVisible: boolean;
  activeIndex: number;
  onClose: () => void;
}

interface IconBoxProps {
  source: React.FC<SVGProps>;
  onPress: () => void;
  style?: ViewStyle;
}

const IconBox = ({ source, style, onPress }: IconBoxProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: neutral22,
        borderWidth: 1,
        borderColor: neutral33,
      }}
    >
      <SVG source={source} height={30} width={30} />
    </TouchableOpacity>
  );
};

export const ImageFullViewModal: React.FC<ImageFullViewModalProps> = ({
  isVisible,
  activeIndex,
  files,
  onClose,
}) => {
  const [localActiveIndex, setLocalActiveIndex] = useState(activeIndex);
  const { height, width } = useWindowDimensions();
  return (
    <ModalBase
      label=" "
      visible={isVisible}
      onClose={onClose}
      width={width - 40}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {localActiveIndex !== 0 && (
          <IconBox
            source={chevronLeft}
            onPress={() => setLocalActiveIndex((prev) => prev - 1)}
          />
        )}
        <Image
          source={{ uri: ipfsURLToHTTPURL(files[localActiveIndex]) }}
          resizeMode="contain"
          style={{
            height: height - 100,
            width: "auto",
            flex: 1,
          }}
        />
        {localActiveIndex < files.length - 1 && (
          <IconBox
            source={chevronRight}
            onPress={() => setLocalActiveIndex((prev) => prev + 1)}
          />
        )}
      </View>
    </ModalBase>
  );
};
