import { TextStyle, View, ViewStyle } from "react-native";

import asteriskSignSVG from "../../../assets/icons/asterisk-sign.svg";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerColumn, SpacerRow } from "../spacer";

export type TextInputLabelProps = {
  labelStyle?: TextStyle;
  isAsterickSign?: boolean;
  subtitle?: string;
  label: string;
};

export const TextInputOutsideLabel: React.FC<TextInputLabelProps> = ({
  labelStyle,
  isAsterickSign,
  subtitle,
  label,
}) => (
  <>
    <View style={rowEndStyle}>
      <View style={rowStyle}>
        <BrandText style={[labelTextStyle, fontSemibold14, labelStyle]}>
          {label}
        </BrandText>
        {isAsterickSign && (
          <>
            <SpacerRow size={0.5} />
            <SVG source={asteriskSignSVG} width={6} height={6} />
          </>
        )}
      </View>
      {subtitle && <BrandText style={fontSemibold13}>{subtitle}</BrandText>}
    </View>
    <SpacerColumn size={1} />
  </>
);

const rowEndStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
};
const rowStyle: ViewStyle = { flexDirection: "row" };
const labelTextStyle: TextStyle = {
  color: neutral77,
};
