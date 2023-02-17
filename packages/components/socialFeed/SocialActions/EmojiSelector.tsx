import React, { useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import {
  neutral33,
  neutral67,
  secondaryColor,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import EmojiModal from "../../EmojiModal";
import { SVG } from "../../SVG";
import emojiSVG from "../../assets/icons/emoji.svg";

type EmojiSelectorProps = {
  onEmojiSelected?: (emoji: string) => void;
  containerStyle?: ViewStyle;
  optionsContainer?: ViewStyle;
  isLoading?: boolean;
};

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  onEmojiSelected,
  containerStyle,
  optionsContainer,
  isLoading,
}) => {
  const [isEmojiModalVisible, setIsEmojiModalVisible] = useState(false);

  const toggleEmojiModal = () =>
    !isLoading && setIsEmojiModalVisible(!isEmojiModalVisible);

  return (
    <Menu
      opened={isEmojiModalVisible}
      style={containerStyle}
      onBackdropPress={toggleEmojiModal}
    >
      <MenuTrigger onPress={toggleEmojiModal} style={styles.icon}>
        {isLoading ? (
          <ActivityIndicator animating color={secondaryColor} />
        ) : (
          <SVG source={emojiSVG} height={16} width={16} />
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
          onEmojiSelected={(e) => {
            if (e) {
              onEmojiSelected?.(e);
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
    paddingVertical: 4,
    paddingHorizontal: 10,
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
    width: 308,
    height: 300,
  },
  optionsContainer: {
    marginTop: 44,
    backgroundColor: "transparent",
  },
});
