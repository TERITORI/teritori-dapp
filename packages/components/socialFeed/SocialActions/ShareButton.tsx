import React, { useState } from "react";
import { View, Linking, TouchableOpacity } from "react-native";

import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import {
  neutral00,
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SocialButton } from "../../buttons/SocialButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerRow } from "../../spacer";

interface ShareButtonProps {
  postId: string;
  useAltStyle?: boolean;
}

export const ShareButton = ({ postId, useAltStyle }: ShareButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const SOCIAL_BUTTONS = [
    {
      text: "Twitter",
      iconSvg: twitterSVG,
      onPress: () => {
        const message = `${window.location.origin}/feed/post/${postId}
#Teritori`;

        Linking.openURL(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            message,
          )}`,
        );
        setIsModalVisible(false);
      },
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={[
          { flexDirection: "row", alignItems: "center" },
          useAltStyle && {
            paddingVertical: layout.spacing_x0_75,
            paddingRight: layout.spacing_x1_5,
            paddingLeft: layout.spacing_x1,
            borderRadius: 999,
            backgroundColor: neutral00,
            borderColor: neutral33,
            borderWidth: 1,
          },
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <SVG
          source={shareSVG}
          width={20}
          height={20}
          color={useAltStyle ? neutralA3 : secondaryColor}
        />
        {useAltStyle && (
          <>
            <SpacerRow size={0.75} />
            <BrandText
              style={[fontSemibold13, useAltStyle && { color: neutralA3 }]}
            >
              Share
            </BrandText>
          </>
        )}
      </TouchableOpacity>

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
