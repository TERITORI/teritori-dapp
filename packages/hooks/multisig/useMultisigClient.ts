import {
  MultisigServiceClientImpl,
  GrpcWebImpl,
} from "../../api/multisig/v1/multisig";
import { getNetwork } from "../../networks";

// we use a hook to prevent huge refactor in the future if it starts depending on state

export const useMultisigClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (network?.testnet) {
    const rpc = new GrpcWebImpl(
      process.env.MULTISIG_BACKEND_URL ||
        "https://multisig.testnet.teritori.com",
      {
        debug: false,
      },
    );
    return new MultisigServiceClientImpl(rpc);
  } else {
    const rpc = new GrpcWebImpl(
      process.env.MULTISIG_BACKEND_URL ||
        "https://multisig.mainnet.teritori.com",
      {
        debug: false,
      },
    );
    return new MultisigServiceClientImpl(rpc);
  }
};
