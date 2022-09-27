// libraries
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";
import styled from "styled-components/native";

// components

// styles
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { fontSemibold14 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
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
    <Container fullWidth>
      <Header>
        <DivRow jc="center" ai="center">
          <SVG source={icon} width={14} height={14} />
          <SpacerRow size={1.5} />
          <BrandText style={[fontSemibold14, { lineHeight: 14 }]}>
            {title}
          </BrandText>
        </DivRow>

        <ChevronContainer onPress={toggleExpansion}>
          <SVG
            source={isExpanded ? chevronDownSVG : chevronUpSVG}
            fill="red"
            width={16}
            height={16}
          />
        </ChevronContainer>
      </Header>
      <View style={genericStyles.w100}>{children}</View>
    </Container>
  );
};

const Container = styled(TertiaryBox)({});

const Header = styled.View(({ theme: { layout } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  width: "100%",
  padding: layout.padding_x2,
}));

const ChevronContainer = styled.Pressable(({ theme: { colors, layout } }) => ({
  ...StyleSheet.flatten(genericStyles.jcAiCenter),
  height: layout.icon,
  width: layout.icon,
  borderRadius: layout.icon / 2,
  background: colors.neutral33,
  borderWidth: 1,
  borderColor: colors.neutral44,
}));
