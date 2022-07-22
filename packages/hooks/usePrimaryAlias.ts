import { useEffect, useState } from "react";

import { useSigningClient } from "../context/cosmwasm";
import { useStore } from "../store/cosmwasm";

export function usePrimaryAlias() {
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  const setPrimaryAlias = useStore((state) => state.setPrimaryAlias);
  const alias = useStore((state) => state.primaryAlias);

  //const [alias, setAlias] = useState<string | undefined>()
  const [loadingAlias, setLoading] = useState(false);

  const { signingClient } = useSigningClient();
  const walletAddress = useStore((state) => state.walletAddress);

  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return;
    }

    const getAlias = async () => {
      setLoading(true);
      try {
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
  }, [walletAddress]);

  return { alias, loadingAlias };
}
