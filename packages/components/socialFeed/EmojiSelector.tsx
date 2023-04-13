import React, { useState } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import emojiSVG from "../../../assets/icons/emoji.svg";
import {
  neutral33,
  neutral67,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

type EmojiSelectorProps = {
  onEmojiSelected: (emoji: string) => void;
  optionsContainer?: ViewStyle;
  isLoading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  onEmojiSelected,
  optionsContainer,
  isLoading,
  buttonStyle,
  disabled,
}) => {
  const [isEmojiModalVisible, setIsEmojiModalVisible] = useState(false);

  const toggleEmojiModal = () =>
    !isLoading && setIsEmojiModalVisible(!isEmojiModalVisible);
  const EmojiModal = React.lazy(() => import("../EmojiModal"));
  return (
    <Menu opened={isEmojiModalVisible} onBackdropPress={toggleEmojiModal}>
      <MenuTrigger
        onPress={() => !disabled && toggleEmojiModal()}
        disabled={disabled}
        style={[styles.icon, buttonStyle]}
      >
        {isLoading ? (
          <ActivityIndicator animating color={secondaryColor} />
        ) : (
          <SVG
            source={emojiSVG}
            color={disabled ? neutral77 : secondaryColor}
          />
        )}
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: StyleSheet.flatten([
            styles.optionsContainer,
            optionsContainer,
          ]),
        }}
      >
        <EmojiModal
          onEmojiSelected={(emoji) => {
            if (emoji) {
              onEmojiSelected(emoji);
            }
            toggleEmojiModal();
          }}
          containerStyle={styles.modalContainer}
          searchStyle={{
            backgroundColor: neutral33,
            // @ts-ignore
            color: secondaryColor,
          }}
          headerStyle={{
            color: secondaryColor,
          }}
          onPressOutside={toggleEmojiModal}
        />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
    backgroundColor: neutral33,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: neutral67,
    borderWidth: 1,
    borderColor: neutral33,
    paddingTop: layout.padding_x0_75,
    marginRight: layout.padding_x2,
    width: 308,
    height: 300,
  },
  optionsContainer: {
    marginTop: 44,
    backgroundColor: "transparent",
  },
});
