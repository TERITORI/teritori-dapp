import { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import governanceCircleSVG from "../../../../assets/icons/governance-circle.svg";
import {
  additionalGreen,
  neutral00,
  neutral44,
  orangeDefault,
  redDefault,
} from "../../../utils/style/colors";
import { SVG } from "../../SVG";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SpacerRow } from "../../spacer";

export const SocialThreadGovernance: React.FC<{
  squaresBackgroundColor?: string;
}> = ({ squaresBackgroundColor }) => {
  const [isGovernanceAction, setGovernanceAction] = useState(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setGovernanceAction((prev) => !prev)}
      >
        <SVG source={governanceCircleSVG} height={36} width={36} />
      </TouchableOpacity>
      {isGovernanceAction && (
        <View style={{ flexDirection: "row", marginLeft: 12 }}>
          <SecondaryButton
            squaresBackgroundColor={squaresBackgroundColor}
            text="Yes!"
            size="SM"
            backgroundColor={additionalGreen}
            textStyle={{ color: neutral00 }}
          />
          <SpacerRow size={1.5} />
          <SecondaryButton
            squaresBackgroundColor={squaresBackgroundColor}
            text="No!"
            size="SM"
            backgroundColor={orangeDefault}
            textStyle={{ color: neutral00 }}
          />
          <SpacerRow size={1.5} />
          <SecondaryButton
            squaresBackgroundColor={squaresBackgroundColor}
            text="NoWithVeto!"
            size="SM"
            backgroundColor={redDefault}
            textStyle={{ color: neutral00 }}
          />
          <SpacerRow size={1.5} />
          <SecondaryButton
            squaresBackgroundColor={squaresBackgroundColor}
            text="Abstain"
            size="SM"
            backgroundColor={neutral44}
            textStyle={{ color: neutral00 }}
          />
        </View>
      )}
    </View>
  );
};
