import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import { BrandText } from "../../../../components/BrandText";
import { SpacerColumn } from "../../../../components/spacer";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import BlurViewWrapper from "../../components/BlurViewWrapper";
import { CustomButton } from "../../components/Button/CustomButton";

const KEY =
  "0xb0b099df345359d948b59adaa3435b2484849335385f2594385ae8f1849019492019f25b5";

export const ShowPrivateKey = () => {
  const [revealKey, setRevealKey] = useState(false);

  const onCopyPrivateKeyPress = async () => {
    await Clipboard.setStringAsync(KEY);
    alert("Copied");
  };

  const onToggleKeyPress = async () => {
    setRevealKey((prev) => !prev);
  };

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

        <BlurViewWrapper show={revealKey} wrapperStyle={{ height: 138 }}>
          <BrandText style={[fontSemibold14, { textAlign: "center" }]}>
            {KEY}
          </BrandText>
        </BlurViewWrapper>

        <SpacerColumn size={1.5} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: layout.spacing_x2,
          }}
        >
          <CustomButton
            title={revealKey ? "Hide" : "View"}
            onPress={onToggleKeyPress}
            type="gray"
            size="small"
            width={75}
          />
          <CustomButton
            title="Copy"
            onPress={onCopyPrivateKeyPress}
            type="gray"
            size="small"
            width={75}
          />
        </View>
      </View>
    </View>
  );
};
