import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ConnectAdenaButton } from "./ConnectAdenaButton";
import { ConnectKeplrButton } from "./ConnectKeplrButton";
import { ConnectLeapButton } from "./ConnectLeapButton";
import { ConnectMetamaskButton } from "./ConnectMetamaskButton";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DisclaimerPopup } from "../PopupDisclaimer/DisclaimerPopup";
import { TertiaryButton } from "../buttons/TertiaryButton";
import ModalBase from "../modals/ModalBase";
import { SeparatorGradient } from "../separators/SeparatorGradient";
import { SpacerColumn } from "../spacer";

type ConnectWalletProps = {
  onClose: () => void;
  visible: boolean;
};

export const ConnectWalletModal: React.FC<ConnectWalletProps> = ({
  onClose,
  visible,
}) => {
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  // functions
  const toggleDisclaimer = () => setIsDisclaimerVisible(!isDisclaimerVisible);

  return (
    <ModalBase
      label="Connect Wallet"
      description="Choose Blockchain of the wallet that you want to add to your Multi-wallet profile"
      onClose={onClose}
      visible={visible}
      hideMainSeparator
      width={457}
    >
      <ConnectKeplrButton onDone={onClose} />
      <SpacerColumn size={1.5} />
      <ConnectLeapButton onDone={onClose} />
      <SpacerColumn size={1.5} />
      <ConnectMetamaskButton onDone={onClose} />
      <SpacerColumn size={1.5} />
      <ConnectAdenaButton onDone={onClose} />
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  footer: { padding: layout.spacing_x4, paddingBottom: layout.spacing_x2_5 },
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
