import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";

import playIcon from "../../../assets/icons/play.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TogglePlayerButton: FC = () => {
  const isMobile = useIsMobile();
  const { setIsMediaPlayerOpen, isMediaPlayerOpen } = useMediaPlayer();
  return (
    <TouchableOpacity
      onPress={() =>
        setIsMediaPlayerOpen((isMediaPlayerOpen) => !isMediaPlayerOpen)
      }
    >
      <TertiaryBox
        noBrokenCorners
        mainContainerStyle={{
          flexDirection: "row",
          paddingHorizontal: layout.spacing_x1,
        }}
        height={isMobile ? 32 : 40}
        width={isMobile ? 32 : 40}
      >
        <View style={isMediaPlayerOpen && { transform: [{ rotate: "90deg" }] }}>
          <SVG
            source={playIcon}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
