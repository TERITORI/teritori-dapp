// libraries
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

// styles
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { neutral33, neutral44 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { DivRow } from "../div";
import { SpacerRow } from "../spacer";

type CollapsableSectionProps = {
  title: string;
  icon: React.FC<SvgProps>;
};

// TODO: add animation
export const CollapsableSection: React.FC<CollapsableSectionProps> = ({
  title,
  icon,
  children,
}) => {
  // variables
  const [isExpanded, setIsExpanded] = useState(false);

  // hooks

  // functions
  const toggleExpansion = () => setIsExpanded(!isExpanded);

  // returns
  return (
    <TertiaryBox>
      <View style={styles.Header}>
        <DivRow jc="center" ai="center">
          <SVG source={icon} width={14} height={14} />
          <SpacerRow size={1.5} />
          <BrandText style={[fontSemibold14, { lineHeight: 14 }]}>
            {title}
          </BrandText>
        </DivRow>

        <Pressable style={styles.ChevronContainer} onPress={toggleExpansion}>
          <SVG
            source={isExpanded ? chevronDownSVG : chevronUpSVG}
            fill="red"
            width={16}
            height={16}
          />
        </Pressable>
      </View>
      <View style={genericStyles.w100}>{children}</View>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  Header: {
    ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
    width: "100%",
    padding: layout.padding_x2,
  },

  ChevronContainer: {
    ...StyleSheet.flatten(genericStyles.jcAiCenter),
    height: layout.icon,
    width: layout.icon,
    borderRadius: layout.icon / 2,
    background: neutral33,
    borderWidth: 1,
    borderColor: neutral44,
  },
});
