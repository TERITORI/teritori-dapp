import { View, StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { SpacerColumn } from "../../../components/spacer";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../utils/style/fonts";

type TitleBarProps = {
  icon?: React.FC<SvgProps> | string;
  iconSize?: number;
  title: string;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
};

export default function TitleBar({
  icon,
  title,
  subTitle,
  style,
  iconSize,
}: TitleBarProps) {
  return (
    <View style={[{ alignItems: "center", justifyContent: "center" }, style]}>
      {icon && (
        <>
          <SVGorImageIcon icon={icon} iconSize={iconSize || 45} />
          <SpacerColumn size={1} />
        </>
      )}
      <BrandText style={fontSemibold30}>{title}</BrandText>
      {subTitle && (
        <>
          <SpacerColumn size={0.6} />
          <BrandText style={[fontMedium16, { color: neutralA3 }]}>
            {subTitle}
          </BrandText>
        </>
      )}
    </View>
  );
}
