import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { neutral00 } from "../../../utils/style/colors";
import EnrollStatsSection from "./EnrollStatsSection";
import { RiotGameHeader } from "./RiotGameHeader";

type GameContentViewProps = {
  containerStyle?: ViewStyle;
  bgImage?: ImageSourcePropType;
};

const GameContentView: React.FC<GameContentViewProps> = ({
  containerStyle,
  bgImage,
  ...props
}) => {
  const content = (
    <ScrollView>
      <EnrollStatsSection />

      <>{props.children}</>
    </ScrollView>
  );

  return (
    <View style={[styles.container, containerStyle]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
});

export default GameContentView;
