import React from "react";
import { ImageBackground, View } from "react-native";

import backgroundPic from "../../../../assets/banners/freelance-service/background-pic.png";
import checkIcon from "../../../../assets/icons/blue-check.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import {
  neutral00,
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { ServiceLevels } from "../types/fields";

const SERVICE_FEE_IN_TORI = 150;

export const SecondRightCard: React.FC<{
  serviceLevels: ServiceLevels;
  selected: Set<number>;
}> = ({ serviceLevels, selected }) => {
  const getTotalPrice = (serviceLevels: ServiceLevels, selected: Set<number>) =>
    serviceLevels.extras
      .filter((element, index) => selected.has(index))
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue.price.value;
      }, serviceLevels.price.value);

  return (
    <TertiaryBox width={440}>
      <View
        style={{
          padding: 20,
          width: 400,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <ImageBackground
            source={backgroundPic}
            style={{ width: 88, height: 88, marginRight: 24 }}
          />
          <BrandText style={[fontSemibold20]}>
            I will design 3 modern minimalist logo designs
          </BrandText>
        </View>
        <View
          style={{ height: 1, backgroundColor: neutral33, marginTop: 20 }}
        />
        <View>
          <View
            style={{
              display: "flex",
              marginTop: 20,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20]}>{serviceLevels.text}</BrandText>
            <BrandText style={[fontSemibold20]}>
              {serviceLevels.price.value} {serviceLevels.price.currency}
            </BrandText>
          </View>

          {serviceLevels.included.map((item) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 12,
              }}
            >
              <SVG
                source={checkIcon}
                width={16}
                height={16}
                style={{ marginRight: 12 }}
              />
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginRight: 24 }]}
              >
                {item}
              </BrandText>
            </View>
          ))}

          <View
            style={{
              height: 1,
              backgroundColor: neutral33,
              marginTop: 20,
              marginBottom: 8,
            }}
          />

          {serviceLevels.extras
            .filter((element, index) => selected.has(index))
            .map((extraService) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <SVG
                    source={checkIcon}
                    width={16}
                    height={16}
                    style={{ marginRight: 12 }}
                  />
                  <BrandText style={[fontSemibold16, { color: neutral77 }]}>
                    {extraService.text}
                  </BrandText>
                </View>
                <BrandText style={[fontSemibold14]}>
                  {extraService.price.value} {extraService.price.currency}
                </BrandText>
              </View>
            ))}

          <View
            style={{ height: 1, backgroundColor: neutral33, marginTop: 20 }}
          />
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Sub-total
            </BrandText>
            <BrandText style={[fontSemibold20]}>
              {getTotalPrice(serviceLevels, selected)}{" "}
              {serviceLevels.price.currency}
            </BrandText>
          </View>
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Service Fee
            </BrandText>
            <BrandText style={[fontSemibold20]}>
              {SERVICE_FEE_IN_TORI} {serviceLevels.price.currency}
            </BrandText>
          </View>
          <View
            style={{ height: 1, backgroundColor: neutral33, marginTop: 20 }}
          />
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Total
            </BrandText>
            <BrandText style={[fontSemibold20]}>
              {getTotalPrice(serviceLevels, selected) + SERVICE_FEE_IN_TORI}{" "}
              {serviceLevels.price.currency}
            </BrandText>
          </View>
          <View
            style={{
              display: "flex",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              Delivery Time
            </BrandText>
            <BrandText style={[fontSemibold20]}>
              {serviceLevels.daysToDelivery} days.
            </BrandText>
          </View>
        </View>
        <SecondaryButton
          text="Confirm & Pay"
          size="SM"
          fullWidth
          color={neutral00}
          backgroundColor={primaryColor}
          style={{ marginTop: 24, marginBottom: 20 }}
        />
        <BrandText
          style={[fontMedium14, { color: neutral77, textAlign: "center" }]}
        >
          You will be charged{" "}
          {getTotalPrice(serviceLevels, selected) + SERVICE_FEE_IN_TORI}{" "}
          {serviceLevels.price.currency}
        </BrandText>
      </View>
    </TertiaryBox>
  );
};
