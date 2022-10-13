import { useEffect, useState } from "react";

import { getFirstKeplrAccount, getSigningCosmWasmClient } from "../utils/keplr";
import { useIsKeplrConnected } from "./useIsKeplrConnected";

export function usePrimaryAlias() {
  const contract = process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;

  const [alias, setPrimaryAlias] = useState("");

  const [loadingAlias, setLoading] = useState(false);

  const isKeplrConnected = useIsKeplrConnected();

  useEffect(() => {
    if (!isKeplrConnected) {
      return;
    }

    const getAlias = async () => {
      setLoading(true);
      try {
        const signingClient = await getSigningCosmWasmClient();

        const walletAddress = (await getFirstKeplrAccount()).address;

        const aliasResponse = await signingClient.queryContractSmart(contract, {
          primary_alias: {
            address: walletAddress,
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
