import { StyleProp, View, ViewStyle, useWindowDimensions } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import infoSVG from "../../../../assets/icons/info-blue.svg";
import warningSVG from "../../../../assets/icons/warning.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerRow } from "../../../components/spacer";
import {
  blueDefault,
  errorColor,
  neutral11,
  successColor,
  yankeesBlue,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface MiniToastProp {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function MiniToast({
  message,
  type = "info",
  onClose,
  style,
}: MiniToastProp) {
  const width = useWindowDimensions().width;
  const backgroundColor = type === "info" ? yankeesBlue : neutral11;
  const borderColor =
    type === "error"
      ? errorColor
      : type === "success"
        ? successColor
        : blueDefault;

  return (
    <View
      style={[
        {
          flex: 1,
          width: width - 40,
          height: 40,
          maxHeight: 40,
          borderWidth: 1,
          borderColor,
          backgroundColor,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: layout.borderRadius,
          paddingHorizontal: layout.spacing_x2,
          marginHorizontal: layout.spacing_x2,
          zIndex: 999,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {type !== "success" && (
          <>
            <SVG
              width={22}
              height={22}
              source={type === "error" ? warningSVG : infoSVG}
            />
            <SpacerRow size={1.5} />
          </>
        )}
        <BrandText style={fontSemibold13}>{message}</BrandText>
      </View>

      {onClose && (
        <CustomPressable onPress={onClose}>
          <SVG source={closeSVG} width={22} height={22} />
        </CustomPressable>
      )}
    </View>
  );
}
