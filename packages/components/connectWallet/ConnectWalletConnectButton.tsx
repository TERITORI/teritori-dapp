import React from "react";
import QRCode from "react-native-qrcode-svg";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";
import { useWalletConnect } from "../../context/WalletConnectProvider";
import { isMobileBrowser } from "../../utils/browser";

export const ConnectWalletConnectButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { connect, pairingURI } = useWalletConnect();
  return (
    <>
      <ConnectWalletButton
        text="Wallet Connect"
        icon={walletConnectSVG}
        iconSize={16}
        onPress={async () => {
          try {
            await connect();
          } catch (err) {
            onDone && onDone(err);
            return;
          }
          onDone && onDone();
        }}
      />
      {!isMobileBrowser() && pairingURI && (
        <QRCode value={pairingURI} size={600} />
      )}
    </>
  );
};
