import { StyleSheet, TextStyle, View } from "react-native";

import asteriskSignSVG from "../../../assets/icons/asterisk-sign.svg";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerColumn, SpacerRow } from "../spacer";

type TextInputLabelProps = {
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
    <View style={styles.rowEnd}>
      <View style={styles.row}>
        <BrandText style={[styles.labelText, fontSemibold14, labelStyle]}>
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  rowEnd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  row: { flexDirection: "row" },
  labelText: {
    color: neutral77,
  },
});
