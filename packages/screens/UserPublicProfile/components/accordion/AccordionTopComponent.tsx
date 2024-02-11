import { Decimal } from "@cosmjs/math";
import moment from "moment";
import React from "react";
import { Control, FieldArrayWithId } from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";
import defaultTierImage from "../../../../../assets/default-images/default-tier-thumbnail.png";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { getNativeCurrency } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { neutral77, neutralA3, secondaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "@/utils/style/fonts";
import { SubscriptionFormValues } from "@/utils/types/premiumFeed";

interface AccordionTopProps {
  isOpen: boolean;
  setIsOpen: (item: boolean) => void;
  networkId: string;
  control: Control<SubscriptionFormValues>;
  elem: FieldArrayWithId<SubscriptionFormValues, "tiers", "id">;
  elemIndex: number;
}

export const AccordionTopComponent = ({
  isOpen,
  setIsOpen,
  networkId,
  control,
  elem: tier,
  elemIndex: tierIndex,
}: AccordionTopProps) => {
  const currency = getNativeCurrency(networkId, tier?.denom);

  if (isOpen) {
    return (
      <View
        style={{
          borderBottomColor: neutral77,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          height: 32,
        }}
      >
        <TextInputCustom
          hideLabel
          noBrokenCorners
          rules={{ required: true }}
          control={control}
          placeHolder="Tier name"
          textInputStyle={fontSemibold16}
          placeholderTextColor={neutralA3}
          name={`tiers.${tierIndex}.title`}
          label="Tier name"
          variant="noStyle"
        />

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            setIsOpen(false);
          }}
        >
          <SVG
            source={chevronUpSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", justifyContent: "space-between" }}
        onPress={() => {
          setIsOpen(!isOpen);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <OptimizedImage
            sourceURI={tier?.imageURI}
            fallbackURI={defaultTierImage}
            style={{
              backgroundColor: "black",
              height: 48,
              width: 48,
              borderRadius: 8,
            }}
            height={48}
            width={48}
          />
          <View style={{ justifyContent: "space-between", height: "100%" }}>
            <BrandText
              style={[
                fontSemibold16,
                { color: secondaryColor, marginLeft: layout.spacing_x1 },
              ]}
            >
              {tier?.title || "New Tier"}
            </BrandText>
            <BrandText
              style={[
                fontSemibold14,
                { color: neutral77, marginLeft: layout.spacing_x1 },
              ]}
            >
              {!!tier.amount && !!tier.denom && !!tier.durationDays
                ? `${prettyPrice(
                    networkId,
                    Decimal.fromUserInput(
                      tier?.amount || "0",
                      currency?.decimals || 0,
                    ).atomics,
                    tier.denom,
                  )} for ${moment.duration(tier.durationDays, "days").humanize()}`
                : "Configure me"}
            </BrandText>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG
            source={chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>
      </TouchableOpacity>
    );
  }
};
