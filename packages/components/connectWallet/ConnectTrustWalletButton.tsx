import { ConnectWalletButton } from "./components/ConnectWalletButton";
import walletConnectSVG from "../../../assets/icons/wallet-connect.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getEthereumNetwork, selectableEthereumNetworks } from "../../networks";
import {
  setIsTrustWalletConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
export const ConnectTrustWalletButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const selectedNetworkId = useSelectedNetworkId();

  const getTrustWalletInjectedProvider = async (
    { timeout } = { timeout: 3000 }
  ) => {
    const provider = getTrustWalletFromWindow();
    if (provider) {
      return provider;
    }
    return listenForTrustWalletInitialized({ timeout });
  };
  const listenForTrustWalletInitialized = async (
    { timeout } = { timeout: 3000 }
  ) => {
    return new Promise((resolve) => {
      const handleInitialization = () => {
        resolve(getTrustWalletFromWindow());
      };
      window.addEventListener("trustwallet#initialized", handleInitialization, {
        once: true,
      });
      setTimeout(() => {
        window.removeEventListener(
          "trustwallet#initialized",
          handleInitialization
        );
        resolve(null);
      }, timeout);
    });
  };

  const getTrustWalletFromWindow = () => {
    const isTrustWallet = (ethereum: any) => {
      const trustWallet = !!ethereum.isTrust;
      return trustWallet;
    };
    const injectedProviderExist =
      typeof window !== "undefined" &&
      typeof (window as any).ethereum !== "undefined";
    // No injected providers exist.
    if (!injectedProviderExist) {
      return null;
    }

    // Trust Wallet was injected into window.ethereum.
    if (isTrustWallet((window as any).ethereum)) {
      return (window as any).ethereum;
    }
    // Trust Wallet provider might be replaced by another
    // injected provider, check the providers array.
    if ((window as any).ethereum?.providers) {
      // ethereum.providers array is a non-standard way to
      // preserve multiple injected providers. Eventually, EIP-5749
      // will become a living standard and we will have to update this.
      return (window as any).ethereum.providers.find(isTrustWallet) ?? null;
    }
    // Trust Wallet injected provider is available in the global scope.
    // There are cases that some cases injected providers can replace window.ethereum
    // without updating the ethereum.providers array. To prevent issues where
    // the TW connector does not recognize the provider when TW extension is installed,
    // we begin our checks by relying on TW's global object.
    return (window as any)["trustwallet"] ?? null;
  };

  const handlePress = async () => {
    try {
      const injectedProvider = await getTrustWalletInjectedProvider();
      const accounts = await injectedProvider.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      dispatch(setIsTrustWalletConnected(true));

      let network = getEthereumNetwork(selectedNetworkId);
      if (!network) {
        if (selectableEthereumNetworks.length) {
          network = selectableEthereumNetworks[0];
        }
      }
      if (!network) {
        throw new Error("no suitable network");
      }
      setSelectedNetworkId(network.id);
      dispatch(setSelectedWalletId(`trust-${account}`));
      onDone && onDone();
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Trust wallet",
          message: err.message,
        });
      }
      onDone && onDone(err);
    }
  };
  return (
    <ConnectWalletButton
      text="Trust Wallet"
      icon={walletConnectSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
