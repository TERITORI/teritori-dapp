import React, { useState } from "react";
import { useWindowDimensions, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";

import chevronLeft from "@/assets/icons/chevron-left.svg";
import chevronRight from "@/assets/icons/chevron-right.svg";
import { neutral22, neutral33 } from "../../utils/style/colors";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import ModalBase from "../modals/ModalBase";

const ESTIMATED_MODAL_HEADER_HEIGHT = 110;

interface ImageFullViewModalProps {
  files: string[];
  isVisible: boolean;
  activeIndex: number;
  onClose: () => void;
}

interface PrevNextButtonProps {
  source: React.FC<SvgProps>;
  onPress: () => void;
}

const PrevNextButton = ({ source, onPress }: PrevNextButtonProps) => {
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
        zIndex: 9999,
        elevation: 99,
      }}
    >
      <SVG source={source} height={30} width={30} />
    </TouchableOpacity>
  );
};

export const ImagesFullViewModal: React.FC<ImageFullViewModalProps> = ({
  isVisible,
  activeIndex,
  files,
  onClose,
}) => {
  const [localActiveIndex, setLocalActiveIndex] = useState(activeIndex);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const contentHeight =
    height - (insets.top + insets.bottom) - ESTIMATED_MODAL_HEADER_HEIGHT;

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
          height: contentHeight,
        }}
      >
        {localActiveIndex !== 0 && (
          <PrevNextButton
            source={chevronLeft}
            onPress={() => setLocalActiveIndex((prev) => prev - 1)}
          />
        )}
        <OptimizedImage
          sourceURI={files[localActiveIndex]}
          width={1600}
          height={800}
          resizeMode="contain"
          style={{
            height: "95%",
            width: "auto",
            flex: 1,
          }}
        />
        {localActiveIndex < files.length - 1 && (
          <PrevNextButton
            source={chevronRight}
            onPress={() => setLocalActiveIndex((prev) => prev + 1)}
          />
        )}
      </View>
    </ModalBase>
  );
};
