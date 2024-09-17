import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { TeritoriNameServiceQueryClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  CosmosNetworkInfo,
  getNetwork,
  GnoNetworkInfo,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
} from "@/networks";
import { gnoCurrencies } from "@/networks/gno-dev/currencies";
import { extractGnoNumber } from "@/utils/gno";

// TODO: move all ns hooks to a hooks/ns directory

const getGnoMintPrice = async (network: GnoNetworkInfo, tokenId: string) => {
  const provider = new GnoJSONRPCProvider(network.endpoint);
  const rawResp = await provider.evaluateExpression(
    network.nameServiceContractAddress,
    `minFee`,
  );
  console.log({ rawResp });

  const price = extractGnoNumber(rawResp);
  return {
    denom: gnoCurrencies[0].denom,
    amount: String(price),
    invalid: false,
  };
};

const getTeritoriMintPrice = async (
  network: CosmosNetworkInfo,
  tokenId: string,
) => {
  if (!network.nameServiceContractAddress) return null;

  const client = await mustGetNonSigningCosmWasmClient(network?.id);

  const tnsClient = new TeritoriNameServiceQueryClient(
    client,
    network.nameServiceContractAddress,
  );

  const info = await tnsClient.contractInfo();

  try {
    const amount = await tnsClient.mintPrice({ tokenId });
    return {
      denom: info.native_denom,
      amount: amount?.toString() || "0",
      invalid: false,
    };
  } catch (e) {
    if (e instanceof Error && e.message.includes("Token Name Invalid")) {
      return { denom: info.native_denom, amount: "0", invalid: true };
    }
    throw e;
  }
};

export const useNSMintPrice = (
  networkId: string | undefined,
  tokenId: string,
) => {
  const { data, ...other } = useQuery(
    ["nsMintPrice", networkId, tokenId],
    async () => {
      if (!tokenId || tokenId !== tokenId.toLowerCase()) {
        return {
          denom: "unknown",
          amount: "0",
          invalid: true,
        };
      }

      const network = getNetwork(networkId);
      if (!network) return null;

      switch (network.kind) {
        case NetworkKind.Cosmos:
          return getTeritoriMintPrice(network, tokenId);
        case NetworkKind.Gno:
          return getGnoMintPrice(network, tokenId);
        default:
          return null;
      }
    },
    { staleTime: Infinity },
  );

  return { nsMintPrice: data, ...other };
};
