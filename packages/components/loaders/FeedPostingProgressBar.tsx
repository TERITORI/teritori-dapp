import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo } from "react";
import { View } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SpacerColumn, SpacerRow } from "../spacer";

export enum FeedPostingStepId {
  UNDEFINED = "UNDEFINED",
  GENERATING_KEY = "GENERATING_KEY",
  UPLOADING_FILES = "UPLOADING_FILES",
  PROPOSING = "PROPOSING",
  POSTING = "POSTING",
  DONE = "DONE",
}
interface FeedPostingStep {
  id: FeedPostingStepId;
  label: string;
  progress: number;
}

// Uploading files on IPFS is the longest step, so we progress from .1 to .9 (Visually better on the loading bar)
const uploadStepProgressStart = 0.1;
const uploadStepProgressEnd = 0.9;

const feedPostingSteps: FeedPostingStep[] = [
  {
    id: FeedPostingStepId.UNDEFINED,
    label: "",
    progress: 0,
  },
  {
    id: FeedPostingStepId.GENERATING_KEY,
    label: "Generating Upload Key...",
    progress: 0.05,
  },
  {
    id: FeedPostingStepId.UPLOADING_FILES,
    label: "Uploading Files...",
    progress: uploadStepProgressStart,
  },
  {
    id: FeedPostingStepId.PROPOSING,
    label: "Proposing...",
    progress: uploadStepProgressEnd,
  },
  {
    id: FeedPostingStepId.POSTING,
    label: "Posting...",
    progress: uploadStepProgressEnd,
  },
  {
    id: FeedPostingStepId.DONE,
    label: "Done",
    progress: 1,
  },
];

export const feedPostingStep = (id: FeedPostingStepId) =>
  feedPostingSteps.find((step) => step.id === id) || feedPostingSteps[0];

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
