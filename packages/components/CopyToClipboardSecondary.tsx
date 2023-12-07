import React from "react";
import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "./BrandText";
import { useCopyToClipboard } from "./CopyToClipboard";
import { NetworkIcon } from "./NetworkIcon";
import { SVG } from "./SVG";
import { LegacyTertiaryBox } from "./boxes/LegacyTertiaryBox";
import copySVG from "../../assets/icons/copy.svg";
import { fontMedium14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

export const CopyToClipboardSecondary: React.FC<{
  text: string;
  displayedText: string;
  iconSVG?: React.FC<SvgProps>;
  networkIcon?: string;
}> = ({ text, displayedText, iconSVG, networkIcon }) => {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <TouchableOpacity onPress={() => copyToClipboard(text)}>
      <LegacyTertiaryBox
        height={40}
        width={216}
        mainContainerStyle={{
          paddingHorizontal: layout.spacing_x1_5,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        {networkIcon && <NetworkIcon size={16} networkId={networkIcon} />}
        {iconSVG && <SVG width={16} height={16} source={iconSVG} />}
        <BrandText
          style={[
            fontMedium14,
            { width: "100%", marginHorizontal: layout.spacing_x1_5 },
          ]}
          numberOfLines={1}
        >
          {displayedText}
        </BrandText>
        <SVG width={16} height={16} source={copySVG} />
      </LegacyTertiaryBox>
    </TouchableOpacity>
  );
};
