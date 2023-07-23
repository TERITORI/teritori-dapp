import React from "react";
import { Linking, View } from "react-native";

import twitterSVG from "../../../assets/icons/twitter.svg";
import { BrandText } from "../../components/BrandText";
import { SocialButton } from "../../components/buttons/SocialButton";
import ModalBase from "../../components/modals/ModalBase";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useTNS } from "../../context/TNSProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork } from "../../networks";
import { neutral00, neutral33, neutral77 } from "../../utils/style/colors";

const Footer: React.FC<{ tokenId: string }> = ({ tokenId }) => {
  const selectedWallet = useSelectedWallet();
  // FIXME: this only works on web
  const SOCIAL_BUTTONS = [
    {
      text: "Twitter",
      iconSvg: twitterSVG,
      onPress: () => {
        const message = `I just acquired my '${tokenId}' handle on @TeritoriNetwork, which will allow me to use the decentralized Social Hub! ⛩️
Alpha v0.1 is live 🔥
${window?.location.origin}/user/tori-${selectedWallet?.address}
#Teritori #Alpha #SocialHub #Cosmos #IBCGang`;
        Linking.openURL(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
        );
      },
    },
  ];
  return (
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
};

interface TNSRegisterSuccessProps {
  visible: boolean;
  onClose: () => void;
}

export const TNSRegisterSuccess: React.FC<TNSRegisterSuccessProps> = ({
  onClose,
  visible,
}) => {
  const { name } = useTNS();
  const selectedNetworkId = useSelectedNetworkId();
  const network = getCosmosNetwork(selectedNetworkId);
  const tokenId = name + network?.nameServiceTLD || "";

  return (
    <ModalBase
      visible={visible}
      onClose={() => onClose()}
      width={457}
      label="Success"
      childrenBottom={<Footer tokenId={tokenId} />}
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
