import React, { ReactNode, useMemo, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

// misc
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import {
  neutral33,
  neutral44,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

type CollapsableSectionProps = {
  title: string;
  icon: React.FC<SvgProps>;
  isExpandedByDefault?: boolean;
  children: ReactNode;
};

export const CollapsableSection: React.FC<CollapsableSectionProps> = ({
  title,
  icon,
  children,
  isExpandedByDefault = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault);
  const style = useMemo(
    () => ({
      height: isExpanded ? undefined : 0,
      opacity: isExpanded ? 1 : 0,
    }),
    [isExpanded],
  );

  // functions
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TertiaryBox>
      <Pressable onPress={toggleExpansion} style={headerCStyle}>
        <View style={rowWithCenterCStyle}>
          <SVG source={icon} width={14} height={14} color={secondaryColor} />
          <SpacerRow size={1.5} />
          <BrandText style={[fontSemibold14, { lineHeight: 14 }]}>
            {title}
          </BrandText>
        </View>

        <View
          style={[
            chevronContainerCStyle,
            isExpanded ? null : { transform: "rotate(0.5turn)" },
          ]}
        >
          <SVG
            source={chevronDownSVG}
            width={16}
            height={16}
            color={isExpanded ? primaryColor : secondaryColor}
          />
        </View>
      </Pressable>
      <View style={[childrenContainerCStyle, style]}>
        <View style={childrenContainerCStyle}>{children}</View>
      </View>
    </TertiaryBox>
  );
};

const headerCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: layout.spacing_x2,
};

const rowWithCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const chevronContainerCStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  height: layout.iconButton,
  width: layout.iconButton,
  borderRadius: layout.iconButton / 2,
  backgroundColor: neutral33,
  borderWidth: 1,
  borderColor: neutral44,
};

const childrenContainerCStyle: ViewStyle = {
  width: "100%",
};
