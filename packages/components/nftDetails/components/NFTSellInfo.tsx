import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";

import { TeritoriNftVaultQueryClient } from "../../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import {
  getNativeCurrency,
  getNetwork,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { trimFixed } from "../../../utils/numbers";
import { fontMedium14 } from "../../../utils/style/fonts";
import { NFTInfo } from "../../../utils/types/nft";
import { BrandText } from "../../BrandText";

export const NFTSellInfo: React.FC<{
  nftInfo?: NFTInfo;
  price: string;
}> = ({ nftInfo, price }) => {
  const networkId = nftInfo?.networkId;

  const vaultConfig = useVaultConfig(networkId);
  const currency = getNativeCurrency(networkId, nftInfo?.mintDenom);

  if (!currency || !vaultConfig || !nftInfo || !networkId) {
    return null;
  }

  const nftRoyalty = nftInfo.royalty || 0;

  const platformFeePercent = parseInt(vaultConfig.fee_bp || "0", 10) / 100;
  const platformFee = platformFeePercent / 100;

  const feeGain = nftRoyalty + platformFee;

  let willReceive = "?";

  try {
    const decPrice = Decimal.fromUserInput(price, currency.decimals);
    const foo = (decPrice.toFloatApproximation() * (1 - feeGain)).toFixed(
      currency.decimals,
    );
    const willReceiveDec = Decimal.fromUserInput(foo, currency.decimals);
    willReceive = prettyPrice(
      networkId,
      willReceiveDec.atomics,
      nftInfo.mintDenom,
    );
  } catch {}

  return (
    <>
      <BrandText style={[fontMedium14, { marginBottom: 8 }]}>
        Artist Royalty: {trimFixed((nftRoyalty * 100).toFixed(2))}%
      </BrandText>
      <BrandText style={[fontMedium14, { marginBottom: 8 }]}>
        Platform Fee: {trimFixed((platformFee * 100).toFixed(2))}%
      </BrandText>
      <BrandText style={fontMedium14}>
        You will receive: {willReceive}
      </BrandText>
    </>
  );
};

const useVaultConfig = (networkId: string | undefined) => {
  const { data } = useQuery(
    ["vaultConfig", networkId],
    async () => {
      const network = getNetwork(networkId);

      if (
        network?.kind !== NetworkKind.Cosmos ||
        !network.vaultContractAddress
      ) {
        return null;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const vaultClient = new TeritoriNftVaultQueryClient(
        cosmwasmClient,
        network.vaultContractAddress,
      );
      return await vaultClient.config();
    },
    {
      staleTime: Infinity,
    },
  );
  return data;
};
