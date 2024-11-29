import React, { FC } from "react";
import { View } from "react-native";

import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { MembershipConfig } from "@/contracts-clients/cw721-membership";
import { useBalances } from "@/hooks/useBalances";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNativeCurrency } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { neutral33, neutral77, secondaryColor } from "@/utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const PremiumSubscriptionBottom: FC<{
  networkId: string;
  item: MembershipConfig | undefined;
  onSubscribe: () => Promise<void> | void;
}> = ({ networkId, item, onSubscribe }) => {
  const selectedWallet = useSelectedWallet();
  const { balances } = useBalances(networkId, selectedWallet?.address);

  const mintDenom = item?.price.denom;

  const nativeCurrency = getNativeCurrency(networkId, mintDenom);
  const currencyBalance = balances.find((bal) => bal.denom === mintDenom);

  return (
    <View style={{ width: "100%" }}>
      <Separator />

      <View
        style={{
          marginTop: layout.spacing_x2,
          marginHorizontal: layout.spacing_x2,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <BrandText
            style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
          >
            Subscription price:
          </BrandText>

          <SpacerColumn size={1} />

          <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
            {prettyPrice(networkId, item?.price.amount, item?.price.denom)}
          </BrandText>
        </View>

        <View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText
              style={[
                fontSemibold14,
                {
                  color: neutral77,
                },
              ]}
            >
              Pay with:
            </BrandText>
            <PrimaryBox
              style={{
                height: 28,
                flexDirection: "row",
                paddingHorizontal: layout.spacing_x1,
                marginLeft: layout.spacing_x2,
                backgroundColor: neutral33,
                alignItems: "center",
                borderColor: neutral33,
                borderRadius: 32,
              }}
            >
              <CurrencyIcon
                icon={nativeCurrency?.icon}
                size={16}
                denom={mintDenom || ""}
                networkId={networkId}
              />

              <BrandText
                style={[
                  fontMedium14,
                  {
                    marginLeft: layout.spacing_x0_5,
                    color: secondaryColor,
                  },
                ]}
              >
                {nativeCurrency?.displayName}
              </BrandText>
            </PrimaryBox>
          </View>
          <SpacerColumn size={1} />

          <BrandText
            style={[
              fontSemibold14,
              { color: neutral77, lineHeight: 20, textAlign: "right" },
            ]}
          >
            Balance:
            <BrandText
              style={[
                fontSemibold14,
                {
                  color: secondaryColor,
                  lineHeight: 20,
                  marginLeft: layout.spacing_x2,
                },
              ]}
            >
              {prettyPrice(
                networkId,
                currencyBalance?.amount || "0",
                mintDenom,
              )}
            </BrandText>
          </BrandText>
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          marginVertical: layout.spacing_x2,
        }}
      >
        <PrimaryButton
          size="XL"
          text="Subscribe"
          width={424}
          loader
          onPress={onSubscribe}
          disabled={item === undefined}
        />
      </View>
    </View>
  );
};
