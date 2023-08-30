import { StyleProp, ViewStyle, StyleSheet, View } from "react-native";

import checkSVG from "../../../../assets/icons/check.svg";
import { SVG } from "../../../components/SVG";
import {
  neutral17,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";

export const CheckboxDappStore: React.FC<{
  isChecked?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ isChecked = false, style }) => {
  return (
    <View
      style={[
        styles.container,
        isChecked && {
          backgroundColor: primaryColor,
          borderColor: primaryColor,
        },
        style,
      ]}
    >
      {isChecked && (
        <SVG source={checkSVG} width={12} height={12} fill={secondaryColor} />
      )}
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: neutralA3,
    backgroundColor: neutral17,
    justifyContent: "center",
    alignItems: "center",
  },
});
