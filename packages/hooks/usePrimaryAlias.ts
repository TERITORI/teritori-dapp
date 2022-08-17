import { useEffect, useState } from "react";

import { getFirstKeplrAccount, getSigningCosmWasmClient } from "../utils/keplr";
import { useIsKeplrConnected } from "./useIsKeplrConnected";

export function usePrimaryAlias() {
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;

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
      } catch (e) {
        console.error(e.message);
        //setAlias(undefined)
        setPrimaryAlias(null);
      }
    };

    getAlias();
  }, [isKeplrConnected]);

  return { alias, loadingAlias };
}
