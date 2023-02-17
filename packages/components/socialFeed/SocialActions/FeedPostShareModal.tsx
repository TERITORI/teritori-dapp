import React, { useState } from "react";
import { View, Linking } from "react-native";

import shareSVG from "../../../assets/icons/share.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import { layout } from "../../../utils/style/layout";
import { CircleIconBox } from "../../CircleIconBox";
import { SocialButton } from "../../buttons/SocialButton";
import ModalBase from "../../modals/ModalBase";
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
        const message = `${window.location.origin}/feed/post/${postId}
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
      <CircleIconBox icon={shareSVG} onPress={() => setIsModalVisible(true)} />

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
            paddingTop: layout.padding_x2,
            paddingBottom: layout.padding_x4,
          }}
        >
          {SOCIAL_BUTTONS.map((button) => (
            <SocialButton
              key={button.text}
              {...button}
              style={{
                marginHorizontal: layout.padding_x0_75,
              }}
            />
          ))}
        </View>
      </ModalBase>
    </>
  );
};
