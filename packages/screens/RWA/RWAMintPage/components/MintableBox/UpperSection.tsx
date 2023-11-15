import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { UpperSectionProps } from "./types";
import balanceSVG from "../../../../../../assets/icons/balance.svg";
import sigmaSVG from "../../../../../../assets/icons/sigma.svg";
import { BrandText } from "../../../../../components/BrandText";
import FlexRow from "../../../../../components/FlexRow";
import { SVG } from "../../../../../components/SVG";
import { SpacerRow } from "../../../../../components/spacer";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import {
  neutral17,
  neutral22,
  neutral77,
} from "../../../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
} from "../../../../../utils/style/fonts";
import { layout } from "../../../../../utils/style/layout";

type UpperSectionBlockProps = {
  icon: React.FC<SvgProps>;
  label: string;
  value: string;
  style?: ViewStyle;
};

const UpperSectionBlock: React.FC<UpperSectionBlockProps> = ({
  icon,
  label,
  value,
  style,
}) => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();

  return (
    <View
      style={[
        style,
        {
          padding: layout.spacing_x2,
          borderRightColor: theme.borderColor,
          flex: 1,
          flexDirection: "row",
        },
      ]}
    >
      <SVG
        style={{
          backgroundColor: isLightTheme ? "#ECECEC" : neutral22,
          padding: layout.spacing_x1_5,
          borderRadius: 7,
        }}
        source={icon}
        color={theme.textColor}
      />
      <SpacerRow size={1} />
      <View>
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          {label}
        </BrandText>
        <BrandText style={fontSemibold16}>{value}</BrandText>
      </View>
    </View>
  );
};

export const UpperSection: React.FC<UpperSectionProps> = ({
  totalPrice,
  availableBalance,
}) => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();

  return (
    <FlexRow
      style={{
        backgroundColor: isLightTheme ? "#F9F9F9" : neutral17,
        borderBottomColor: theme.borderColor,
        borderBottomWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    >
      {/* Left block */}
      <UpperSectionBlock
        label="Total price:"
        value={totalPrice}
        icon={sigmaSVG}
        style={{ borderRightWidth: 1 }}
      />

      {/* Right block */}
      <UpperSectionBlock
        label="Available balance:"
        value={availableBalance}
        icon={balanceSVG}
      />
    </FlexRow>
  );
};
