import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import checkSVG from "../../../../assets/icons/check.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  blueDefault,
  neutral17,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";

type CheckboxProp = {
  isChecked: boolean;
  value: string;
  size?: "sm" | "md" | "lg" | number;
  type?: "circle" | "box";
  onPress: (isChecked: boolean, value: string) => void;
  checkboxColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  checkboxStyle?: StyleProp<ViewStyle>;
  label?: string;
};

const Checkbox = ({
  isChecked = false,
  value,
  type = "box",
  size = "sm",
  label,
  onPress,
  labelStyle,
  checkboxStyle,
  checkboxColor,
}: CheckboxProp) => {
  const checkboxSize =
    typeof size === "string"
      ? size === "sm"
        ? 16
        : size === "md"
          ? 20
          : 24
      : size;
  const borderRadius = type === "circle" ? checkboxSize / 2 : 5;
  const checkBoxIcon = checkboxSize / 2;

  return (
    <>
      <FlexRow>
        <TouchableOpacity onPress={() => onPress(isChecked, value)}>
          <View
            style={[
              {
                width: checkboxSize,
                height: checkboxSize,
                borderRadius,
                borderWidth: 1,
                borderColor: neutralA3,
                backgroundColor: neutral17,
                justifyContent: "center",
                alignItems: "center",
              },
              isChecked && {
                backgroundColor: blueDefault,
                borderColor: blueDefault,
              },
              checkboxStyle,
            ]}
          >
            {isChecked && (
              <SVG
                source={checkSVG}
                width={checkBoxIcon}
                height={checkBoxIcon}
                fill={checkboxColor ?? secondaryColor}
              />
            )}
          </View>
        </TouchableOpacity>

        {label && (
          <>
            <SpacerRow size={1.4} />

            <BrandText
              style={[fontMedium16, { color: secondaryColor }, labelStyle]}
            >
              {label}
            </BrandText>
          </>
        )}
      </FlexRow>
    </>
  );
};

export default Checkbox;
