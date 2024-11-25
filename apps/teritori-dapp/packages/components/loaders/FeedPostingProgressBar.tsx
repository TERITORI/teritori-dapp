import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo } from "react";
import { View } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SpacerColumn, SpacerRow } from "../spacer";

import {
  FeedPostingStep,
  uploadStepProgressEnd,
  uploadStepProgressStart,
} from "@/utils/feed/posting";

export const FeedPostingProgressBar: FC<{
  step: FeedPostingStep;
  ipfsUploadProgress: number; // 0 to 1
}> = ({ step, ipfsUploadProgress }) => {
  const finalProgressPercent = useMemo(
    () =>
      step.id === "UNDEFINED"
        ? 0
        : step.id === "UPLOADING_FILES"
          ? (uploadStepProgressStart +
              (uploadStepProgressEnd - uploadStepProgressStart) *
                ipfsUploadProgress) *
            100
          : step.progress * 100,
    [step.id, step.progress, ipfsUploadProgress],
  );

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BrandText style={[fontSemibold14, { width: 37 }]}>
          {Math.round(finalProgressPercent)}%
        </BrandText>
        <SpacerRow size={0.5} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          {step.label}
        </BrandText>
      </View>
      <SpacerColumn size={1} />

      <View
        style={{
          height: 4,
          width: `${finalProgressPercent}%`,
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: "100%", width: "100%", borderRadius: 999 }}
          colors={["#2AF598", "#009EFD"]}
        />
      </View>
    </View>
  );
};
