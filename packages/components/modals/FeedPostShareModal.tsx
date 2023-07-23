import React, { useState } from "react";
import { View, Linking } from "react-native";

import ModalBase from "./ModalBase";
import shareSVG from "../../../assets/icons/share.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import { layout } from "../../utils/style/layout";
import { IconBox } from "../IconBox";
import { SocialButton } from "../buttons/SocialButton";
interface FeedPostShareModalProps {
  postId: string;
}

export const FeedPostShareModal = ({ postId }: FeedPostShareModalProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const SOCIAL_BUTTONS = [
    {
      text: "Twitter",
      iconSvg: twitterSVG,
      onPress: () => {
        const message = `${window?.location.origin}/feed/post/${postId}
#Teritori`;

        Linking.openURL(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
        );
        setIsModalVisible(false);
      },
    },
  ];

  return (
    <>
      <IconBox icon={shareSVG} onPress={() => setIsModalVisible(true)} />

      <ModalBase
        label="Share Post"
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        width={320}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: layout.spacing_x2,
            paddingBottom: layout.spacing_x4,
          }}
        >
          {SOCIAL_BUTTONS.map((button) => (
            <SocialButton
              key={button.text}
              {...button}
              style={{
                marginHorizontal: layout.spacing_x0_75,
              }}
            />
          ))}
        </View>
      </ModalBase>
    </>
  );
};
