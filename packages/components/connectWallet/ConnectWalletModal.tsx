// libraries
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import adenaSVG from "../../../assets/icons/adena.svg";
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
import { ConnectKeplrButton } from "./ConnectKeplrButton";
import { ConnectMetamaskButton } from "./ConnectMetamaskButton";
import { ConnectWalletButton } from "./components/ConnectWalletButton";

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
      <ConnectWalletButton
        text="Adena Wallet"
        isComingSoon
        icon={adenaSVG}
        iconSize={20}
      />
      <SpacerColumn size={1.5} />
      <ConnectWalletButton
        text="Wallet Connect"
        isComingSoon
        icon={walletConnectSVG}
      />
      <View style={styles.footer}>
        <SeparatorGradient />
        <SpacerColumn size={4} />
        <BrandText style={styles.footerText}>
          By connecting a wallet, you acknowledge that you have read and
          understand the{" "}
          <BrandText style={styles.footerTextHighlight}>
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

const styles = StyleSheet.create({
  footer: { padding: layout.padding_x4, paddingBottom: layout.padding_x2_5 },
  footerText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
      lineHeight: 20,
    },
  ]),
  footerTextHighlight: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
    },
  ]),
});
