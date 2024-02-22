import { Decimal } from "@cosmjs/math";

import { getNativeCurrency } from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { trimFixed } from "../../../utils/numbers";
import { fontMedium14 } from "../../../utils/style/fonts";
import { NFTInfo } from "../../../utils/types/nft";
import { BrandText } from "../../BrandText";

import { useCw2981RoyaltyInfo } from "@/hooks/marketplace/useCw2981RoyaltyInfo";
import { useMarketplaceConfig } from "@/hooks/marketplace/useMarketplaceConfig";

export const NFTSellInfo: React.FC<{
  nftInfo?: NFTInfo;
  price: string;
}> = ({ nftInfo, price }) => {
  const networkId = nftInfo?.networkId;

  const { marketplaceConfig } = useMarketplaceConfig(networkId);
  const currency = getNativeCurrency(networkId, nftInfo?.mintDenom);
  const { data: royaltyGain } = useCw2981RoyaltyInfo(
    nftInfo?.collectionId,
    nftInfo?.tokenId,
  );

  if (!currency || !marketplaceConfig || !nftInfo || !networkId) {
    return null;
  }

  const platformFeePercent =
    parseInt(marketplaceConfig.fee_bp || "0", 10) / 100;
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
