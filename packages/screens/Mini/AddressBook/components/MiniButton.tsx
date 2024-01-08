import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { blueDefault } from "../../../../utils/style/colors";
import { fontSemibold15 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

interface MiniButtonProps {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  buttonColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export default function MiniButton({
  title,
  onPress,
  buttonStyle,
  textStyle,
  buttonColor,
  textColor,
}: MiniButtonProps) {
  return (
    <CustomPressable onPress={onPress}>
      <View
        style={[
          {
            backgroundColor: buttonColor ?? blueDefault,
            padding: layout.spacing_x2,
            borderRadius: 999,
            alignItems: "center",
          },
          buttonStyle,
        ]}
      >
        <BrandText
          style={[{ color: textColor ?? "#fff" }, fontSemibold15, textStyle]}
        >
          {title}
        </BrandText>
      </View>
    </CustomPressable>
  );
}
