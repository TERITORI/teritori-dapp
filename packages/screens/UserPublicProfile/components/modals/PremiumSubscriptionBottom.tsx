import React from "react";
import { View } from "react-native";

import usdcSVG from "../../../../../assets/icons/crypto-usdc.svg";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useBalances } from "@/hooks/useBalances";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getStakingCurrency } from "@/networks";
import { premiumPrice } from "@/utils/coins";
import { neutral33, neutral77, secondaryColor } from "@/utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const PremiumSubscriptionBottom = ({
  onSubscribe,
}: {
  onSubscribe: () => void;
}) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const nativeCurrency = getStakingCurrency(selectedNetworkId);
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const currencyBalance = balances.find(
    (bal) => bal.denom === nativeCurrency?.denom,
  );
  const amountUsd = currencyBalance?.usdAmount || 0;

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
            $9.99
          </BrandText>
        </View>

        <View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <BrandText
              style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
            >
              Pay by:
            </BrandText>
            <PrimaryBox
              style={{
                height: 28,
                flexDirection: "row",
                paddingHorizontal: layout.spacing_x1_5,
                marginLeft: layout.spacing_x0_5,
                backgroundColor: neutral33,
                alignItems: "center",
                borderColor: neutral33,
                borderRadius: 32,
              }}
            >
              <SVG source={usdcSVG} width={16} height={16} />

              <BrandText
                style={[
                  fontMedium14,
                  {
                    marginLeft: layout.spacing_x0_5,
                    color: secondaryColor,
                    lineHeight: layout.spacing_x2,
                  },
                ]}
              >
                USDC
              </BrandText>
            </PrimaryBox>
          </View>
          <SpacerColumn size={1} />

          <BrandText
            style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
          >
            Balance:{" "}
            <BrandText
              style={[
                fontSemibold14,
                { color: secondaryColor, lineHeight: 20 },
              ]}
            >
              {premiumPrice(
                selectedNetworkId,
                currencyBalance?.amount,
                currencyBalance?.denom,
              )}{" "}
              <BrandText
                style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
              >
                ${parseFloat(amountUsd.toFixed(2).toString())}
              </BrandText>
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
        />
      </View>
    </View>
  );
};
