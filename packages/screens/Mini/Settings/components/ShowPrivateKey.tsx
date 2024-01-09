import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { View } from "react-native";

import { CustomButton } from "./CustomButton";
import { RedAlert } from "./RedAlert";
import eyeClosedSVG from "../../../../../assets/icons/eye-closed.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerColumn } from "../../../../components/spacer";
import { neutral09 } from "../../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

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
        marginTop: layout.spacing_x4,
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      <View>
        <RedAlert description="Do not share your private key! Anyone with your private key will have full control of your wallet." />
        <SpacerColumn size={1.5} />
        <View
          style={{
            borderRadius: layout.borderRadius,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.20)",
            paddingHorizontal: layout.spacing_x3,
            position: "relative",
            marginBottom: layout.spacing_x1_5,
            backgroundColor: neutral09,
            justifyContent: "center",
            height: 138,
          }}
        >
          <BrandText style={[fontSemibold14, { textAlign: "center" }]}>
            {KEY}
          </BrandText>

          {!revealKey && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.80)",
                borderRadius: layout.borderRadius,
              }}
            >
              <SVG
                source={eyeClosedSVG}
                height={20}
                width={20}
                style={{ marginBottom: layout.spacing_x1_5 }}
              />
              <BrandText style={[fontSemibold13, {}]}>
                Make sure no one is watching your screen
              </BrandText>
            </View>
          )}
        </View>
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
