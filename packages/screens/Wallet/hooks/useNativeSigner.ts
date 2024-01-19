import { SigningStargateClient } from "@cosmjs/stargate";

import { useNativeWallet } from "./useNativeWallet";
import { mustGetCosmosNetwork } from "../../../networks";
import { addSelected } from "../../../store/slices/wallets";
import { useAppDispatch } from "../../../store/store";

export const useNativeSigner = async () => {
  const dispatch = useAppDispatch();
  const networkId = "teritori";
  const network = mustGetCosmosNetwork(networkId);

  const wallet = await useNativeWallet();
  const rpcEndpoint = network.rpcEndpoint;
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
  );
  if (!client) {
    throw new Error("Native Wallet not ready");
  }
  const [firstAccount] = await wallet.getAccounts();
  dispatch(
    addSelected({
      publicKey: firstAccount.address,
      network: network.kind,
    }),
  );
  return client;
};
