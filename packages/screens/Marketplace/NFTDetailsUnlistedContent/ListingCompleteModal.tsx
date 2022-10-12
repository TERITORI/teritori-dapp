import React from "react";
import { View } from "react-native";

import checkmarkCircleSVG from "../../../../assets/icons/checkmark-circle.svg";
import discordSVG from "../../../../assets/icons/discord.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SocialButton } from "../../../components/buttons/SocialButton";
import ModalBase from "../../../components/modals/ModalBase";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";

interface ListingCompleteModalProps {
  onClose?: () => void;
  visible?: boolean;
}

export const ListingCompleteModal: React.FC<ListingCompleteModalProps> = ({
  onClose,
  visible,
}) => {
  if (!visible) {
    return null;
  }

  const SOCIAL_BUTTONS = [
    {
      text: "Discord",
      iconSvg: discordSVG,
      onPress: () => {},
    },
    {
      text: "Website",
      iconSvg: websiteSVG,
    },
    {
      text: "Twitter",
      iconSvg: twitterSVG,
    },
  ];
  const Header = () => (
    <>
      <View>
        <BrandText style={[fontSemibold16]}>Listing Completed</BrandText>
      </View>
    </>
  );

  const Footer = () => (
    <View
      style={{
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderColor: neutral33,
      }}
    >
      <BrandText
        style={{
          fontSize: 16,
          color: neutral77,
          textAlign: "center",
        }}
      >
        Share with friends via
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}
      >
        {SOCIAL_BUTTONS.map((button) => (
          <SocialButton
            key={button.text}
            {...button}
            style={{
              marginHorizontal: 6,
            }}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ModalBase
      label=""
      onClose={onClose}
      visible={visible}
      Header={Header}
      childrenBottom={Footer()}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 200,
        }}
      >
        <SVG source={checkmarkCircleSVG} height={132} width={132} />
      </View>
    </ModalBase>
  );
};
