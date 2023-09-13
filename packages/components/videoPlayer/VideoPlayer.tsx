import React, { useState } from "react";
import { View, Pressable, ViewStyle } from "react-native";

import Avatar from "../../../assets/icons/player/avatar.svg";
import Next from "../../../assets/icons/player/next.svg";
import Pause from "../../../assets/icons/player/pause.svg";
import Play from "../../../assets/icons/player/play.svg";
import { neutral17, neutral22, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerColumn, SpacerRow } from "../spacer";
const componentHeight = 48;
export const VideoPlayer: React.FC = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const clickPlayPause = () => {
    setIsPlay(!isPlay);
  };
  return (
    <View style={containerStyle}>
      <View style={playHandleBoxStyle}>
        <Pressable onPress={clickPlayPause}>
          {isPlay && <SVG source={Pause} height={28} width={28} />}
          {!isPlay && <SVG source={Play} height={28} width={28} />}
        </Pressable>
        <SpacerRow size={3} />
        <StandardIcon source={Next} />
      </View>
      <View style={durationBoxStyle}>
        <SVG
          source={Avatar}
          height={layout.spacing_x4}
          width={layout.spacing_x4}
        />
        <SpacerRow size={5} />
        <View style={infoBoxStyle}>
          <BrandText style={fontSemibold14}>Song Name</BrandText>
          <SpacerColumn size={0.5} />
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Artist
          </BrandText>
        </View>
      </View>
    </View>
  );
};

const StandardIcon: React.FC<{ source: any }> = ({ source }) => {
  return (
    <Pressable>
      <SVG
        source={source}
        width={layout.spacing_x2_5}
        height={layout.spacing_x2_5}
      />
    </Pressable>
  );
};

const containerStyle: ViewStyle = {
  backgroundColor: neutral17,
  height: componentHeight,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: neutral22,
  paddingHorizontal: layout.spacing_x3,
};
const playHandleBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const durationBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const infoBoxStyle: ViewStyle = {
  justifyContent: "center",
};
