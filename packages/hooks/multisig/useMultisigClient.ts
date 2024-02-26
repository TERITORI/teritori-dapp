import { BrowserHeaders } from "browser-headers";
import { useMemo } from "react";

import {
  MultisigServiceClientImpl,
  GrpcWebImpl,
} from "@/api/multisig/v1/multisig";
import { useKeycloak } from "@/context/web3auth/KeycloakProvider";
import { getNetwork } from "@/networks";

// we use a hook to prevent huge refactor in the future if it starts depending on state

export const useMultisigClient = (networkId: string | undefined) => {
  const { token: accessToken } = useKeycloak();
  const network = getNetwork(networkId);
  const client = useMemo(() => {
    if (!accessToken) {
      return undefined;
    }
    const metadata = new BrowserHeaders();
    metadata.set("Authorization", accessToken);
    if (network?.testnet) {
      const rpc = new GrpcWebImpl("http://localhost:3002", {
        debug: false,
        metadata,
      });
      return new MultisigServiceClientImpl(rpc);
    } else {
      const rpc = new GrpcWebImpl(
        process.env.MULTISIG_BACKEND_URL ||
          "https://multisig.mainnet.teritori.com",
        {
          debug: false,
          metadata,
        },
      );
      return new MultisigServiceClientImpl(rpc);
    }
  }, [accessToken, network?.testnet]);
  return client;
};
