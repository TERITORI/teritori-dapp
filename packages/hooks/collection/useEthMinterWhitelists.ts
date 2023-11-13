import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import Long from "long";

import { TeritoriMinter__factory } from "../../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { NetworkKind, getNetwork } from "../../networks";
import { MintPhase } from "../../utils/collection";
import { getEthereumProvider } from "../../utils/ethereum";

export const useEthMinterWhitelists = (
  networkId: string | undefined,
  mintAddress: string | undefined,
  enabled?: boolean,
) => {
  if (enabled === undefined) {
    enabled = true;
  }
  return useQuery(
    ["ethMinterIsWhitelists", networkId, mintAddress],
    async () => {
      if (!mintAddress) {
        return undefined;
      }

      const network = getNetwork(networkId);
      if (network?.kind !== NetworkKind.Ethereum) {
        return undefined;
      }

      const provider = await getEthereumProvider(network);
      if (!provider) {
        return undefined;
      }

      const minterClient = TeritoriMinter__factory.connect(
        mintAddress,
        provider,
      );
      const whitelistPhases: MintPhase[] = [];
      let isLastPhase = false;
      let phase = BigNumber.from(0);

      while (!isLastPhase) {
        const phaseConfig = await minterClient.callStatic.whitelists(phase);

        const size = await minterClient.callStatic.whitelistSize(phase);

        const mintPeriod = Long.fromString(phaseConfig.mintPeriod.toString());

        // If phase is invalid
        if (!phaseConfig.mintPeriod.toNumber()) {
          isLastPhase = true;
        } else {
          whitelistPhases.push({
            mintMax: Long.fromString(phaseConfig.mintMax.toString()),
            mintPeriod,
            start: Long.fromNumber(-1),
            end: Long.fromNumber(-1),
            mintPrice: Long.fromString(phaseConfig.mintPrice.toString()),
            size: Long.fromString(size.toString()),
          });
          phase = phase.add(1);
          isLastPhase = false;
        }
      }

      return whitelistPhases;
    },
    { staleTime: Infinity, enabled: enabled && !!networkId && !!mintAddress },
  );
};
