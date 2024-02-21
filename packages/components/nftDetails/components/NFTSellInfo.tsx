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
        return 0;
      }

      const [network, mintContractAddress] = parseCollectionId(collectionId);
      if (!network) {
        return 0;
      }

      const client = await mustGetNonSigningCosmWasmClient(network.id);

      const getRoyaltyGain = async (contractAddress: string) => {
        const cwClient = new Cw721MembershipQueryClient(
          client,
          contractAddress,
        );
        const res = await cwClient.extension({
          msg: {
            RoyaltyInfo: {
              token_id: tokenId,
              sale_price: royaltyQueryRange.toString(),
            },
          },
        });
        if (!("royalty_amount" in res) || !res.royalty_amount) {
          throw new Error("RoyaltyInfo response is invalid");
        }
        return +res.royalty_amount / royaltyQueryRange;
      };

      try {
        const cwClient = new Cw721MembershipQueryClient(
          client,
          mintContractAddress,
        );

        const checkRes = await cwClient.extension({
          msg: { CheckRoyalties: {} },
        });
        if (!("check_royalties" in checkRes) || !checkRes.check_royalties) {
          return 0;
        }

        return await getRoyaltyGain(mintContractAddress);
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("unknown variant `extension`")
        ) {
          const conf = await client.queryContractSmart(mintContractAddress, {
            config: {},
          });

          const nftContractAddr = conf.nft_addr || conf.child_contract_addr;
          return await getRoyaltyGain(nftContractAddr);
        }
        throw err;
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
