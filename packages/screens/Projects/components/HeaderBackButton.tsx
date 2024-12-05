import React from "react";
import { TouchableOpacity } from "react-native";

import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { useAppNavigation } from "../../../utils/navigation";

import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";

export const HeaderBackButton: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Projects")}>
      <FlexRow>
        <SVG source={chevronLeftSVG} width={24} height={24} />
        <SpacerRow size={2} />
        <ScreenTitle>Projects Program</ScreenTitle>
      </FlexRow>
    </TouchableOpacity>
  );
};
