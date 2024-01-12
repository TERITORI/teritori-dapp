import React, { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import addSVG from "../../../../../assets/icons/add-circle-blue.svg";
import linesSVG from "../../../../../assets/icons/lines-gray.svg";
import minusSVG from "../../../../../assets/icons/minus-circle-red.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type MenuItemProps = {
  icon: string | FC<SvgProps>;
  title: string;
  subTitle?: string;
  onPress?: () => void;
  isAdded?: boolean;
  isEditing?: boolean;
};

export const DAppStoreMenuItem = ({
  icon,
  onPress,
  title,
  subTitle,
  isAdded,
  isEditing,
}: MenuItemProps) => {
  if (!isAdded && !isEditing) {
    return null;
  }
  return (
    <CustomPressable
      onPress={onPress}
      style={{
        paddingVertical: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        {isEditing && isAdded && <SVG source={minusSVG} />}
        {isEditing && !isAdded && <SVG source={addSVG} />}
        <SVGorImageIcon icon={icon} iconSize={24} />
        <View>
          <BrandText style={[fontSemibold22, {}]}>{title}</BrandText>
          {subTitle && (
            <BrandText style={[fontMedium13, { color: neutralA3 }]}>
              {subTitle}
            </BrandText>
          )}
        </View>
      </View>
      {isEditing && isAdded && <SVG source={linesSVG} height={20} width={20} />}
    </CustomPressable>
  );
};
