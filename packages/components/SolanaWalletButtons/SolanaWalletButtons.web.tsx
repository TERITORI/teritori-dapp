import React from "react";

import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "../../utils/solana-wallet-adapter-react-ui";

export const SolanaConnectButton = () => <WalletMultiButton />;

export const SolanaDisconnectButton = () => <WalletDisconnectButton />;
