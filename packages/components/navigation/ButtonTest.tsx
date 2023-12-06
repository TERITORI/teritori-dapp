import React from "react";
import { View } from "react-native";

import { NewBox } from "./NewBox";
import { LegacyPrimaryBox } from "../../components/boxes/LegacyPrimaryBox";
import { PrimaryBox } from "../../components/boxes/PrimaryBox";
import { BrandText } from "../BrandText";

export const ButtonTest = () => {
  return (
    <View
      style={{
        padding: 100,
      }}
    >
      <LegacyPrimaryBox
        mainContainerStyle={{
          height: 120,
        }}
        squaresBackgroundColor="white"
      >
        <BrandText>Test box (old)</BrandText>
      </LegacyPrimaryBox>

      <PrimaryBox
        style={{
          height: 120,
          marginTop: 40,
          backgroundColor: "red",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandText>Test box (new)</BrandText>
        </View>
      </PrimaryBox>
    </View>
  );
};
