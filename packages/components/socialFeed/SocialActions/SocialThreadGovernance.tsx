import { useState } from "react";
import { View } from "react-native";

import governanceCircleSVG from "../../../../assets/icons/governance-circle.svg";
import {
  additionalGreen,
  neutral00,
  neutral44,
  orangeDefault,
  redDefault,
} from "../../../utils/style/colors";
import { SVG } from "../../SVG";
import { CustomPressable } from "../../buttons/CustomPressable";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SpacerRow } from "../../spacer";

export const SocialThreadGovernance: React.FC<{
  squaresBackgroundColor?: string;
}> = ({ squaresBackgroundColor }) => {
  const [isGovernanceAction, setGovernanceAction] = useState(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {isGovernanceAction && (
        <View style={{ flexDirection: "row", marginRight: 12 }}>
          <SecondaryButton
            text="Yes!"
            size="SM"
            backgroundColor={additionalGreen}
            textStyle={{ color: neutral00 }}
          />
          <SpacerRow size={1.5} />
          <SecondaryButton
            text="No!"
            size="SM"
            backgroundColor={orangeDefault}
            textStyle={{ color: neutral00 }}
          />
          <SpacerRow size={1.5} />
          <SecondaryButton
            text="NoWithVeto!"
            size="SM"
            backgroundColor={redDefault}
            textStyle={{ color: neutral00 }}
          />
          <SpacerRow size={1.5} />
          <SecondaryButton
            text="Abstain"
            size="SM"
            backgroundColor={neutral44}
            textStyle={{ color: neutral00 }}
          />
        </View>
      )}
      <CustomPressable onPress={() => setGovernanceAction((prev) => !prev)}>
        <SVG source={governanceCircleSVG} height={36} width={36} />
      </CustomPressable>
    </View>
  );
};
