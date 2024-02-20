import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";

import { NftMarketplaceQueryClient } from "../../../contracts-clients/nft-marketplace/NftMarketplace.client";
import {
  getNativeCurrency,
  getNetwork,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseCollectionId,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { trimFixed } from "../../../utils/numbers";
import { fontMedium14 } from "../../../utils/style/fonts";
import { NFTInfo } from "../../../utils/types/nft";
import { BrandText } from "../../BrandText";

import { Cw721MembershipQueryClient } from "@/contracts-clients/cw721-membership";

const royaltyQueryRange = 1000000;

const useCw2981RoyaltyInfo = (
  collectionId: string | undefined,
  tokenId: string | undefined,
) => {
  return useQuery(
    ["cw2981-royalty-info", collectionId, tokenId],
    async () => {
      if (!collectionId || !tokenId) {
        return null;
      }

      const [network, mintContractAddress] = parseCollectionId(collectionId);
      if (!network) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(network.id);
      const queryClient = new Cw721MembershipQueryClient(
        client,
        mintContractAddress,
      );

      try {
        const checkRes = await queryClient.checkRoyalties();
        if (!checkRes.royalty_payments) {
          return 0;
        }

        const res = await queryClient.royaltyInfo({
          tokenId,
          salePrice: royaltyQueryRange.toString(),
        });

        return (+res.royalty_amount || 0) / royaltyQueryRange;
      } catch (err) {
        console.error("Failed to fetch royalty info", err);
      }
    },
    {
      enabled: !!collectionId,
      staleTime: Infinity,
    },
  );
};

export const NFTSellInfo: React.FC<{
  nftInfo?: NFTInfo;
  price: string;
}> = ({ nftInfo, price }) => {
  const networkId = nftInfo?.networkId;

  const vaultConfig = useVaultConfig(networkId);
  const currency = getNativeCurrency(networkId, nftInfo?.mintDenom);
  const { data: royaltyGain } = useCw2981RoyaltyInfo(
    nftInfo?.collectionId,
    nftInfo?.tokenId,
  );

  if (!currency || !vaultConfig || !nftInfo || !networkId) {
    return null;
  }

  const platformFeePercent = parseInt(vaultConfig.fee_bp || "0", 10) / 100;
  const platformFee = platformFeePercent / 100;

  const feeGain = (royaltyGain || 0) + platformFee;

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
        Artist Royalty: {trimFixed(((royaltyGain || 0) * 100).toFixed(2))}%
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
      const vaultClient = new NftMarketplaceQueryClient(
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
