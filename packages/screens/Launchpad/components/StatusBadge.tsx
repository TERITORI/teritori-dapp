import React from "react";
import { View } from "react-native";

import { Status } from "../../../api/launchpad/v1/launchpad";
import { BrandText } from "../../../components/BrandText";
import { neutral33, neutralFF } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

import { launchpadProjectStatus } from "@/utils/launchpad";
import { neutral00 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

export const StatusBadge: React.FC<{
  projectStatus: Status;
}> = ({ projectStatus }) => {
  const textColor =
    projectStatus === Status.STATUS_UNSPECIFIED ||
    projectStatus === Status.UNRECOGNIZED
      ? neutralFF
      : neutral00;

  const backgroundColor =
    projectStatus === Status.STATUS_INCOMPLETE
      ? "#D2DEFC"
      : projectStatus === Status.STATUS_COMPLETE
        ? "#9990F5"
        : projectStatus === Status.STATUS_REVIEWING
          ? "#9058EC"
          : projectStatus === Status.STATUS_CONFIRMED
            ? "#F46FBF"
            : neutral33;

  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor,
        height: 28,
        paddingHorizontal: layout.spacing_x1_5,
        borderRadius: 999,
        justifyContent: "center",
      }}
    >
      <BrandText style={[fontSemibold13, { color: textColor }]}>
        {launchpadProjectStatus(projectStatus)}
      </BrandText>
    </View>
  );
};
