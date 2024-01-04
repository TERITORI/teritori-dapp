import { StyleProp, View, ViewStyle } from "react-native";

import downArrowSVG from "../../../assets/icons/downArrow.svg";
import upArrowSVG from "../../../assets/icons/upArrow.svg";
import { useIsMobile } from "../../hooks/useIsMobile";
import { errorColor, successColor } from "../../utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const PercentageVolumeCell: React.FC<{
  data: any;
  style?: StyleProp<ViewStyle>;
}> = ({ data, style }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
        },
        style,
      ]}
    >
      {data.includes("+") ? (
        <SVG source={upArrowSVG} />
      ) : (
        <SVG source={downArrowSVG} />
      )}
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          {
            marginLeft: 8,
            color: data.includes("+") ? successColor : errorColor,
          },
        ]}
        numberOfLines={1}
      >
        {data}
      </BrandText>
    </View>
  );
};
