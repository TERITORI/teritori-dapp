import { FC } from "react";
import { SvgProps } from "react-native-svg";

import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import chevronRedRightSVG from "../../../../assets/icons/chevron-right-red.svg";
import { RouteName, useAppNavigation } from "../../../utils/navigation";
import {
  dangerColor,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import ListView from "./ListView";

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
    navigation.replace(navigateTo, { back: "MiniSettings" });
  };
  return (
    <>
      <ListView
        onPress={onMenuItemPress}
        options={{
          label: title,
          leftIconEnabled: icon ? true : false,
          leftIconOptions: {
            icon,
          },
          iconEnabled: true,
          iconOptions: {
            icon: danger ? chevronRedRightSVG : chevronGrayRightSVG,
          },
          labelStyle: { color: danger ? dangerColor : secondaryColor },
          bottomLabel: subtitle,
          leftLabelStyle: { color: danger ? dangerColor : neutralA3 },
        }}
      />
    </>
  );
};
