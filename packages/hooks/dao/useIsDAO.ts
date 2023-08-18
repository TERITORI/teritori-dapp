import { bech32 } from "bech32";

import { NetworkKind, parseUserId } from "../../networks";
import { useCosmWasmContractVersion } from "../cosmwasm/useCosmWasmContractInfo";

export const useIsDAO = (userId: string | undefined) => {
  const [network, address] = parseUserId(userId);
  const { data: contractVersion } = useCosmWasmContractVersion(
    network?.id,
    address
  );
  if (network?.kind === NetworkKind.Gno) {
    try {
      bech32.decode(address);
      return { isDAO: false };
    } catch {}
    return { isDAO: true };
  }
  return {
    isDAO: contractVersion?.contract.includes("dao-core"),
  };
};
