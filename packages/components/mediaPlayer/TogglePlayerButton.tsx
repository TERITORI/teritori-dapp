import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";

import playIcon from "../../../assets/icons/play.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

export const TogglePlayerButton: FC = () => {
  const isMobile = useIsMobile();
  const { setIsMediaPlayerOpen, isMediaPlayerOpen, media } = useMediaPlayer();
  if (!media) return null;
  return (
    <TouchableOpacity
      onPress={() =>
        setIsMediaPlayerOpen((isMediaPlayerOpen) => !isMediaPlayerOpen)
      }
    >
      <LegacyTertiaryBox
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
      </LegacyTertiaryBox>
    </TouchableOpacity>
  );
};
