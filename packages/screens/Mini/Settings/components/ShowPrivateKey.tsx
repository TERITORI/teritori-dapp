import React from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import BlurViewWrapper from "../../components/BlurViewWrapper";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const ShowPrivateKey: React.FC<{ privateKey: string }> = ({
  privateKey,
}) => {
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

        <BlurViewWrapper copy={privateKey} wrapperStyle={{ height: 138 }}>
          <BrandText style={[fontSemibold14, { textAlign: "center" }]}>
            {privateKey}
          </BrandText>
        </BlurViewWrapper>
      </View>
    </View>
  );
};
