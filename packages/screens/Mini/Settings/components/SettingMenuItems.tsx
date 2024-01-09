import { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronGrayRightSVG from "../../../../../assets/icons/chevron-right-gray.svg";
import chevronRedRightSVG from "../../../../../assets/icons/chevron-right-red.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { RouteName, useAppNavigation } from "../../../../utils/navigation";
import {
  dangerColor,
  neutralA3,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type MenuItemProps = {
  icon?: string | FC<SvgProps>;
  title: string;
  subtitle?: string;
  navigateTo: RouteName;
  danger?: boolean;
};
export const SettingMenuItem = ({
  navigateTo,
  title,
  subtitle,
  icon,
  danger = false,
}: MenuItemProps) => {
  const navigation = useAppNavigation();
  const onMenuItemPress = () => {
    navigation.replace(navigateTo);
  };
  return (
    <CustomPressable onPress={onMenuItemPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: layout.spacing_x2,
          marginBottom: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", gap: layout.spacing_x1_5 }}>
          {icon && <SVGorImageIcon icon={icon} iconSize={24} />}
          <View>
            <BrandText
              style={[
                fontSemibold22,
                { color: danger ? dangerColor : secondaryColor },
              ]}
            >
              {title}
            </BrandText>
            {subtitle && (
              <BrandText
                style={[
                  fontMedium13,
                  { color: danger ? dangerColor : neutralA3 },
                ]}
              >
                {subtitle}
              </BrandText>
            )}
          </View>
        </View>
        <SVG
          source={danger ? chevronRedRightSVG : chevronGrayRightSVG}
          height={24}
          width={24}
        />
      </View>
    </CustomPressable>
  );
};
