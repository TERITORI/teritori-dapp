import React, { FC, useCallback, useState } from "react";
import { View } from "react-native";

import ModalBase from "./ModalBase";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "../../networks";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DisclaimerPopup } from "../PopupDisclaimer/DisclaimerPopup";
import { TertiaryButton } from "../buttons/TertiaryButton";
import { ConnectAdenaButton } from "../connectWallet/ConnectAdenaButton";
import { ConnectKeplrButton } from "../connectWallet/ConnectKeplrButton";
import { ConnectLeapButton } from "../connectWallet/ConnectLeapButton";
import { ConnectMetamaskButton } from "../connectWallet/ConnectMetamaskButton";
import { ConnectWalletButton } from "../connectWallet/components/ConnectWalletButton";
import { SeparatorGradient } from "../separators/SeparatorGradient";
import { SpacerColumn } from "../spacer";

export const ConnectWalletModal: FC<{
  forceNetworkFeature?: NetworkFeature;
  label?: string;
  visible?: boolean;
  onClose?: () => void;
}> = ({ label = "Connect Wallet", forceNetworkFeature, visible, onClose }) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const canConnectWallet = useCallback(
    (networkKind: NetworkKind) =>
      selectedNetwork &&
      (!forceNetworkFeature ||
        (selectedNetwork.features.includes(forceNetworkFeature) &&
          selectedNetwork.kind === networkKind)),
    [forceNetworkFeature, selectedNetwork],
  );

  const toggleDisclaimer = () =>
    setIsDisclaimerVisible((isDisclaimerVisible) => !isDisclaimerVisible);

  return (
    <ModalBase visible={visible} onClose={onClose} width={480} label={label}>
      {canConnectWallet(NetworkKind.Cosmos) && (
        <>
          <ConnectKeplrButton onDone={onClose} />
          <SpacerColumn size={1.5} />
          <ConnectLeapButton onDone={onClose} />
          <SpacerColumn size={1.5} />
        </>
      )}
      {canConnectWallet(NetworkKind.Ethereum) && (
        <>
          <ConnectMetamaskButton onDone={onClose} />
          <SpacerColumn size={1.5} />
        </>
      )}
      {canConnectWallet(NetworkKind.Gno) && (
        <>
          <ConnectAdenaButton onDone={onClose} />
          <SpacerColumn size={1.5} />
        </>
      )}
      <ConnectWalletButton
        text="Wallet Connect"
        isComingSoon
        icon={walletConnectSVG}
      />

      <View style={{ paddingVertical: layout.spacing_x2_5 }}>
        <SeparatorGradient />
        <SpacerColumn size={2} />

        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral77,
              lineHeight: 20,
            },
          ]}
        >
          By connecting a wallet, you acknowledge that you have read and
          understand the{" "}
          <BrandText
            style={[
              fontSemibold14,
              {
                color: secondaryColor,
              },
            ]}
          >
            Teritori Protocol Disclaimer.
          </BrandText>
        </BrandText>
        <SpacerColumn size={2} />

        <TertiaryButton
          size="M"
          fullWidth
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
