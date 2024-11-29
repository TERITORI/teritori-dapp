import React, { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import emojiSVG from "../../../assets/icons/emoji.svg";
import emojiSolidSVG from "../../../assets/icons/social/happy-gray.svg";
import { useAppMode } from "../../hooks/useAppMode";
import { neutral33, neutral67, secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import EmojiModal from "../EmojiModal";
import { IconBox } from "../IconBox";

type EmojiSelectorProps = {
  onEmojiSelected: (emoji: string) => void;
  isLoading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const WIDTH = 308;
const HEIGHT = 300;

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  onEmojiSelected,
  isLoading,
  buttonStyle,
  iconStyle,
  disabled,
}) => {
  const [appMode] = useAppMode();

  const [isEmojiModalVisible, setIsEmojiModalVisible] = useState(false);

  const toggleEmojiModal = () =>
    !isLoading && setIsEmojiModalVisible(!isEmojiModalVisible);

  return (
    <Menu
      opened={isEmojiModalVisible}
      onBackdropPress={toggleEmojiModal}
      style={buttonStyle}
    >
      <MenuTrigger onPress={() => !disabled && toggleEmojiModal()}>
        {isLoading ? (
          <ActivityIndicator animating color={secondaryColor} size={32} />
        ) : (
          <IconBox
            icon={appMode === "mini" ? emojiSolidSVG : emojiSVG}
            onPress={toggleEmojiModal}
            disabled={disabled}
            style={iconStyle}
          />
        )}
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            width: WIDTH,
            height: HEIGHT,
            left: 0,
            backgroundColor: "transparent",
          },
        }}
      >
        <EmojiModal
          onEmojiSelected={(emoji) => {
            if (emoji) {
              onEmojiSelected(emoji);
            }
            toggleEmojiModal();
          }}
          containerStyle={{
            paddingHorizontal: layout.spacing_x1,
            paddingVertical: layout.spacing_x1_5,
            backgroundColor: neutral67,
            borderWidth: 1,
            borderColor: neutral33,
            width: WIDTH,
            height: HEIGHT,
          }}
          searchStyle={{
            backgroundColor: neutral33,
            // @ts-expect-error: description todo
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
