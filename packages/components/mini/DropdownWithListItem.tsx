import { NavigationProp } from "@react-navigation/native";
import React, { FC } from "react";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral22 } from "../../utils/style/colors";
import { fontMedium16 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { Dropdown } from "../Dropdown";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { Separator } from "../separators/Separator";

import AddSVG from "@/assets/icons/add-new.svg";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

type DropdownItemType = {
  icon?: FC<SvgProps> | string;
  name: string;
  onPress?: (navigation: NavigationProp<any>) => void;
};

type DropdownWithListItemProps = {
  items: DropdownItemType[];
  icon?: React.FC<SvgProps> | string;
  iconSize?: number;
  positionStyle?: ViewStyle;
  style?: ViewStyle;
};

export const DropdownWithListItem = ({
  items,
  icon,
  iconSize,
  positionStyle = {},
  style = {},
}: DropdownWithListItemProps) => {
  const navigation = useAppNavigation();
  return (
    <View style={{ width: "auto" }}>
      <Dropdown
        triggerComponent={
          <SVG
            source={icon ?? AddSVG}
            width={iconSize ?? 24}
            height={iconSize ?? 24}
          />
        }
        positionStyle={{
          top: 35,
          right: 0,
          ...positionStyle,
        }}
      >
        <View
          style={{
            backgroundColor: neutral22,
            borderRadius: 12,
            width: 252,
            ...style,
          }}
        >
          {items.map((dropdownItem, index) => {
            const { onPress, name, icon } = dropdownItem;
            return (
              <React.Fragment key={dropdownItem.name}>
                <CustomPressable
                  key={dropdownItem.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: 45,
                    gap: 12,
                    paddingHorizontal: layout.spacing_x2,
                  }}
                  onPress={() => {
                    if (!onPress) {
                      return;
                    }

                    onPress(navigation);
                  }}
                >
                  {icon && <SVG source={icon} width={20} height={20} />}
                  <BrandText style={[fontMedium16]}>{name}</BrandText>
                </CustomPressable>
                {items.length - 1 !== index && <Separator />}
              </React.Fragment>
            );
          })}
        </View>
      </Dropdown>
    </View>
  );
};
