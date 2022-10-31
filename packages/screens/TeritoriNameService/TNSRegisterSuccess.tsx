import React from "react";
import { View } from "react-native";

import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import { SocialButton } from "../../components/buttons/SocialButton";
import ModalBase from "../../components/modals/ModalBase";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useTNS } from "../../context/TNSProvider";
import { neutral00, neutral33, neutral77 } from "../../utils/style/colors";

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

const Footer = () => (
  <View
    style={{
      paddingVertical: 20,
      paddingHorizontal: 12,
      borderTopWidth: 1,
      borderColor: neutral33,
      width: "100%",
      alignItems: "center",
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

interface TNSRegisterSuccessProps {
  visible: boolean;
  onClose: () => void;
}

export const TNSRegisterSuccess: React.FC<TNSRegisterSuccessProps> = ({
  onClose,
  visible,
}) => {
  const { name } = useTNS();

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      width={457}
      label="Success"
      childrenBottom={Footer()}
    >
      <View style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
        <NameNFT
          style={{
            backgroundColor: neutral00,
            marginBottom: 20,
            paddingBottom: 48,
            width: "100%",
          }}
          name={name}
        />
      </View>
    </ModalBase>
  );
};
