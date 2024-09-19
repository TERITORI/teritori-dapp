import React from "react";
import { TouchableOpacity } from "react-native";

import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { useAppNavigation } from "../../../utils/navigation";
import { fontSemibold20 } from "../../../utils/style/fonts";

export const LaunchpadERC20CreateTokenHeader: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("LaunchpadERC20Tokens")}
    >
      <FlexRow>
        <SVG source={chevronLeftSVG} width={24} height={24} />
        <SpacerRow size={2} />
        <BrandText style={fontSemibold20}>Launchpad ERC20 Tokens</BrandText>
      </FlexRow>
    </TouchableOpacity>
  );
};
