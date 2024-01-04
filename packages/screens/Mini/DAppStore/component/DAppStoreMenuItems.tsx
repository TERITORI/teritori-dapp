import React, { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type MenuItemProps = {
  icon: string | FC<SvgProps>;
  title: string;
  subTitle?: string;
  onPress?: () => void;
};

export const DAppStoreMenuItem = ({
  icon,
  onPress,
  title,
  subTitle,
}: MenuItemProps) => {
  return (
    <CustomPressable onPress={onPress} style={{ paddingVertical: 12 }}>
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        <SVG source={icon} height={24} width={24} />
        <View>
          <BrandText style={[fontSemibold22, {}]}>{title}</BrandText>
          {subTitle && (
            <BrandText style={[fontMedium13, { color: neutralA3 }]}>
              {subTitle}
            </BrandText>
          )}
        </View>
      </View>
    </CustomPressable>
  );
};
