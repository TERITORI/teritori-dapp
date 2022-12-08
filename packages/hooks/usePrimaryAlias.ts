import { useEffect, useState } from "react";

import { getSigningCosmWasmClient } from "../utils/keplr";
import { useIsKeplrConnected } from "./useIsKeplrConnected";
import useSelectedWallet from "./useSelectedWallet";

export function usePrimaryAlias() {
  const contract = process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;

  const [alias, setPrimaryAlias] = useState("");

  const [loadingAlias, setLoading] = useState(false);

  const isKeplrConnected = useIsKeplrConnected();
  const selectedWallet = useSelectedWallet();

  useEffect(() => {
    if (!isKeplrConnected || !selectedWallet) {
      return;
    }

    const getAlias = async () => {
      setLoading(true);
      try {
        const signingClient = await getSigningCosmWasmClient();

        const aliasResponse = await signingClient.queryContractSmart(contract, {
          primary_alias: {
            address: selectedWallet?.address,
          },
        });
        //setAlias(aliasResponse.username)
        setPrimaryAlias(aliasResponse.username);
        setLoading(false);
      } catch (err) {
        console.error(err);
        //setAlias(undefined)
        setPrimaryAlias("");
      }
    };

    getAlias();
  }, [isKeplrConnected]);

  return { alias, loadingAlias };
}
