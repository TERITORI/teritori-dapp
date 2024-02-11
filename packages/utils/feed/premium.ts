import { Decimal } from "@cosmjs/math";

import { MembershipConfig } from "@/contracts-clients/cw721-membership";
import { getNativeCurrency } from "@/networks";
import { bigDaySeconds } from "@/utils/big-time";
import { SubscriptionFormElem } from "@/utils/types/premium-feed";

export const mapTierToFormElement = (
  networkId: string,
  tier: MembershipConfig,
): SubscriptionFormElem => {
  let amount = "";
  let denom = "";
  if (tier.price) {
    denom = tier.price.denom;
    try {
      const currency = getNativeCurrency(networkId, tier.price.denom);
      if (currency) {
        const inputAmount = Decimal.fromAtomics(
          tier.price.amount,
          currency?.decimals,
        );
        amount = inputAmount.toString();
      }
    } catch (e) {
      console.error("Error parsing tier amount", e);
    }
  }
  let durationDays = "";
  if (tier.duration_seconds) {
    try {
      durationDays = (BigInt(tier.duration_seconds) / bigDaySeconds).toString();
    } catch (e) {
      console.error("Error parsing tier duration", e);
    }
  }
  const formElem = {
    title: tier.display_name,
    description: tier.description,
    amount,
    denom,
    durationDays,
    imageURI: tier.nft_image_uri,
    open: false,
  };
  return formElem;
};
