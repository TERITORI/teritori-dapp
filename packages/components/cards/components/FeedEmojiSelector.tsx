import React, { useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import emojiSVG from "../../../../assets/icons/emoji.svg";
import {
  neutral33,
  neutral67,
  secondaryColor,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import EmojiModal from "../../EmojiModal";
import { SVG } from "../../SVG";

type FeedEmojiSelectorProps = {
  onEmojiSelected?: (emoji: string | null) => void;
  containerStyle?: ViewStyle;
};

export const FeedEmojiSelector: React.FC<FeedEmojiSelectorProps> = ({
  onEmojiSelected,
  containerStyle,
}) => {
  const [isEmojiModalVisible, setIsEmojiModalVisible] = useState(false);

  const toggleEmojiModal = () => setIsEmojiModalVisible(!isEmojiModalVisible);

  return (
    <Menu
      opened={isEmojiModalVisible}
      style={containerStyle}
      onBackdropPress={toggleEmojiModal}
    >
      <MenuTrigger onPress={toggleEmojiModal} style={styles.icon}>
        <SVG source={emojiSVG} height={16} width={16} />
      </MenuTrigger>
      <MenuOptions>
        <EmojiModal
          onEmojiSelected={(e) => {
            onEmojiSelected && onEmojiSelected(e);
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
});
