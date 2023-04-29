import React, { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";
import { useWalletConnect } from "../../context/WalletConnectProvider";
import { isMobileBrowser } from "../../utils/browser";
import { layout } from "../../utils/style/layout";
import ModalBase from "../modals/ModalBase";

export const ConnectWalletConnectButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { connect, pairingURI } = useWalletConnect();
  const { width, height } = useWindowDimensions();
  const smallest = width > height ? height : width;
  const [open, setOpen] = useState(false);
  return (
    <>
      <ConnectWalletButton
        text="Wallet Connect"
        icon={walletConnectSVG}
        iconSize={16}
        onPress={async () => {
          try {
            if (!isMobileBrowser()) {
              setOpen(true);
            }
            await connect();
          } catch (err) {
            onDone && onDone(err);
            return;
          }
          onDone && onDone();
        }}
      />
      {pairingURI && open && (
        <ModalBase label="Scan with Keplr app" onClose={() => setOpen(false)}>
          <View style={{ marginBottom: layout.padding_x3 }}>
            <QRCode value={pairingURI} size={smallest * 0.66} />
          </View>
        </ModalBase>
      )}
    </>
  );
};
