import { useEffect, useState } from "react";

import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../utils/keplr";
import useSelectedWallet from "./useSelectedWallet";

export const useContractClients = (
  contractAddress: string,
  clientClass: any,
  queryClientClass: any
) => {
  const [client, setClient] = useState<typeof clientClass | null>(null);
  const [queryClient, setQueryClient] = useState<
    typeof queryClientClass | null
  >(null);

  const selectedWallet = useSelectedWallet();

  const updateClients = async () => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    const _queryClient = new queryClientClass(
      nonSigningClient,
      contractAddress
    );
    setQueryClient(_queryClient);

    if (selectedWallet) {
      const signingClient = await getSigningCosmWasmClient();
      const _client = new clientClass(
        signingClient,
        selectedWallet.address,
        contractAddress
      );
      setClient(_client);
    }
  };

  useEffect(() => {
    updateClients();
  }, [selectedWallet]);

  return { selectedWallet, client, queryClient };
};
