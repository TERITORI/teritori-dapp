import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { neutral17, neutral33 } from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";

export const CreateShortPostButton: React.FC<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress }) => {
  return (
    <Animated.View style={[styles.selfCenter]}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <BrandText style={fontSemibold28}>+</BrandText>
        <Animated.View style={[styles.textContainer]}>
          <BrandText style={fontSemibold14}>Create post</BrandText>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  selfCenter: {
    alignSelf: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: neutral17,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 999,
    paddingHorizontal: layout.padding_x1_5,
    height: 42,
  },
  textContainer: {
    marginLeft: layout.padding_x1_5,
  },
});
