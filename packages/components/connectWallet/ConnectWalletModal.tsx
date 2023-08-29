// libraries
import React, { useState } from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { ConnectAdenaButton } from "./ConnectAdenaButton";
import { ConnectKeplrButton } from "./ConnectKeplrButton";
import { ConnectMetamaskButton } from "./ConnectMetamaskButton";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DisclaimerPopup } from "../PopupDisclaimer/DisclaimerPopup";
import { SeparatorGradient } from "../SeparatorGradient";
import { TertiaryButton } from "../buttons/TertiaryButton";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

type ConnectWalletProps = {
  onClose: () => void;
  visible: boolean;
};

export const ConnectWalletModal: React.FC<ConnectWalletProps> = ({
  onClose,
  visible,
}) => {
  // variables
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  // functions
  const toggleDisclaimer = () => setIsDisclaimerVisible(!isDisclaimerVisible);

  // returns
  return (
    <ModalBase
      label="Connect Wallet"
      description="Choose Blockchain of the wallet that you want to add to your Multi-wallet profile"
      onClose={onClose}
      visible={visible}
      hideMainSeparator
      width={457}
      noBrokenCorners
    >
      <ConnectMetamaskButton onDone={onClose} />
      <SpacerColumn size={1.5} />
      <ConnectKeplrButton onDone={onClose} />
      <SpacerColumn size={1.5} />
      <ConnectAdenaButton onDone={onClose} />
      <SpacerColumn size={1.5} />
      <ConnectWalletButton
        text="Wallet Connect"
        isComingSoon
        icon={walletConnectSVG}
      />
      <View style={footerStyle}>
        <SeparatorGradient />
        <SpacerColumn size={4} />
        <BrandText style={footerTextStyle}>
          By connecting a wallet, you acknowledge that you have read and
          understand the{" "}
          <BrandText style={footerTextHighlightStyle}>
            Teritori Protocol Disclaimer.
          </BrandText>
        </BrandText>
        <SpacerColumn size={4} />
        <TertiaryButton
          size="M"
          fullWidth
          // disabled
          text="Read the full Disclaimer & Privacy Policy"
          onPress={toggleDisclaimer}
        />
      </View>
      <DisclaimerPopup
        visible={isDisclaimerVisible}
        onClose={toggleDisclaimer}
      />
    </ModalBase>
  );
};

const footerStyle: ViewStyle = {
  padding: layout.padding_x4,
  paddingBottom: layout.padding_x2_5,
};
const footerTextStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
  lineHeight: 20,
};
const footerTextHighlightStyle: TextStyle = {
  ...fontSemibold14,
  color: secondaryColor,
};
