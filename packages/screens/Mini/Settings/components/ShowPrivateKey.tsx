import React from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import { BrandText } from "../../../../components/BrandText";
import { SpacerColumn } from "../../../../components/spacer";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import BlurViewWrapper from "../../components/BlurViewWrapper";

const KEY =
  "0xb0b099df345359d948b59adaa3435b2484849335385f2594385ae8f1849019492019f25b5";

export const ShowPrivateKey = () => {
  return (
    <View
      style={{
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      <View>
        <SpacerColumn size={2} />
        <RedAlert description="Do not share your private key! Anyone with your private key will have full control of your wallet." />
        <SpacerColumn size={1.5} />

        <BlurViewWrapper copy={KEY} wrapperStyle={{ height: 138 }}>
          <BrandText style={[fontSemibold14, { textAlign: "center" }]}>
            {KEY}
          </BrandText>
        </BlurViewWrapper>
      </View>
    </View>
  );
};
