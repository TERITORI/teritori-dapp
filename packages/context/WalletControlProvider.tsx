import React, { ReactNode, createContext, useContext, useState } from "react";

import { Coin } from "../api/teritori-chain/cosmos/base/v1beta1/coin";
import { ConnectWalletModal } from "../components/modals/ConnectWalletModal";
import { NotEnoughFundsModal } from "../components/modals/NotEnoughFundModal";
import { NetworkFeature } from "../networks";

interface ControlledWalletFundsParams {
  cost: Coin;
  action: string;
  networkId?: string;
  address?: string;
}

interface ControlledWalletConnectedParams {
  action: string;
  forceNetworkFeature?: NetworkFeature;
}

interface WalletControlProviderValue {
  showNotEnoughFundsModal: (params: ControlledWalletFundsParams) => void;
  showConnectWalletModal: (params: ControlledWalletConnectedParams) => void;
}

const defaultValue: WalletControlProviderValue = {
  showNotEnoughFundsModal: () => { },
  showConnectWalletModal: () => { },
};

const WalletControlContext = createContext(defaultValue);

export const WalletControlContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [forceNetworkFeature, setForceNetworkFeature] =
    useState<NetworkFeature>();
  const [action, setAction] = useState("");
  const [isNotEnoughFundModalVisible, setIsNotEnoughFundModalVisible] =
    useState(false);
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  const [cost, setCost] = useState<Coin>();
  const [address, setAddress] = useState<string>();

  const showConnectWalletModal = ({
    forceNetworkFeature,
    action,
  }: ControlledWalletConnectedParams) => {
    setForceNetworkFeature(forceNetworkFeature);
    setAction(action);
    setIsNotEnoughFundModalVisible(false);
    setIsConnectWalletVisible(true);
  };
  const showNotEnoughFundsModal = ({
    cost,
    action,
    networkId,
    address,
  }: ControlledWalletFundsParams) => {
    setCost(cost);
    setAction(action);
    setAddress(address);
    setIsNotEnoughFundModalVisible(true);
    setIsConnectWalletVisible(false);
  };

  return (
    <WalletControlContext.Provider
      value={{
        showNotEnoughFundsModal,
        showConnectWalletModal,
      }}
    >
      <NotEnoughFundsModal
        label={"Not enough funds" + (action ? " to " + action : "")}
        cost={cost}
        visible={isNotEnoughFundModalVisible}
        onClose={() => setIsNotEnoughFundModalVisible(false)}
        address={address}
      />
      <ConnectWalletModal
        label={"Connect Wallet" + (action ? " to " + action : "")}
        forceNetworkFeature={forceNetworkFeature}
        visible={isConnectWalletVisible}
        onClose={() => setIsConnectWalletVisible(false)}
      />
      {children}
    </WalletControlContext.Provider>
  );
};

export const useWalletControl = () => useContext(WalletControlContext);
