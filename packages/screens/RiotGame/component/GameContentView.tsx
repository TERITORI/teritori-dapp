import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { neutral00 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { FightStatsSection } from "./FightStatsSection";
import { RiotGameHeader } from "./RiotGameHeader";

type GameContentViewProps = {
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  bgImage?: ImageSourcePropType;
};

export const GameContentView: React.FC<GameContentViewProps> = ({
  containerStyle,
  contentStyle,
  bgImage,
  ...props
}) => {
  const content = (
    <ScrollView style={contentStyle}>
      <FightStatsSection />

      {props.children}
    </ScrollView>
  );

  return (
    <View
      style={[layout.flex_1, { backgroundColor: neutral00 }, containerStyle]}
    >
      <RiotGameHeader />

      {bgImage ? (
        <ImageBackground
          style={{ flex: 1 }}
          source={bgImage}
          resizeMode="cover"
        >
          {content}
        </ImageBackground>
      ) : (
        content
      )}
    </View>
  );
};
