import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";

export const ConnectTrustWalletMobileButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const handlePress = async () => {
    try {
      const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
      });
      if (!connector.connected) {
        connector.createSession();
      }
      connector.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }
        const { accounts, chainId } = payload.params[0];
        console.log(accounts);
        console.log(chainId);
      });
      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }
        const { accounts, chainId } = payload.params[0];
        console.log(accounts);
        console.log(chainId);
      });
      connector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ConnectWalletButton
      text="Trust Wallet (Mobile)"
      icon={walletConnectSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
