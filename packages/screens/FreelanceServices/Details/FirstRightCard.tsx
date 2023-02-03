import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import {
  neutral00,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";

export const FirstRightCard: React.FC = () => {
  return (
    <TertiaryBox width={440}>
      <View
        style={{
          padding: 20,
          width: 400,
        }}
      >
        <BrandText style={[fontSemibold20]}>Price summary</BrandText>
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandText style={{ color: neutral77, fontSize: 16 }}>
            Subtotal
          </BrandText>
          <BrandText style={{ fontSize: 16 }}>1500 TORI</BrandText>
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
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            Service Fee
          </BrandText>
          <BrandText style={[fontSemibold16]}>100 TORI</BrandText>
        </View>
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: neutral77,
            height: 1,
          }}
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
          <BrandText style={[fontSemibold20]}>1500 TORI</BrandText>
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
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            Delivery Time
          </BrandText>
          <BrandText style={[fontSemibold16]}>3 days</BrandText>
        </View>
        <SecondaryButton
          text="Continue to checkout"
          size="SM"
          fullWidth
          color={neutral00}
          backgroundColor={primaryColor}
          style={{ marginTop: 24, marginBottom: 20 }}
        />
        <BrandText
          style={[fontMedium14, { color: neutral77, textAlign: "center" }]}
        >
          You won"t be charged yet
        </BrandText>
      </View>
    </TertiaryBox>
  );
};
