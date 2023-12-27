import React from "react";
import { useWindowDimensions, View } from "react-native";

import { ProgressLine } from "../../../components/ProgressLine";
import { BackButton } from "../../../components/navigation/components/BackButton";
import { layout } from "../../../utils/style/layout";

export const TopBarWithProgress: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        width: "100%",
        flex: 0.5,
        marginTop: layout.spacing_x3,
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <BackButton />
      <ProgressLine
        percent={progress}
        width={width}
        style={{ width: "100%" }}
      />
    </View>
  );
};
