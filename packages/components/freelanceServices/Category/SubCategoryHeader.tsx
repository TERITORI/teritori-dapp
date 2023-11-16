import React from "react";
import { View } from "react-native";

import { fontSemibold28 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText/BrandText";
import { Separator } from "../../Separator";
import { SvgIcon } from "../common/SvgIcon";

type SubCategoryHeaderProps = {
  title: string;
  iconSvg: string;
};

export const SubCategoryHeader: React.FC<SubCategoryHeaderProps> = ({
  title,
  iconSvg,
}) => {
  return (
    <View>
      <SvgIcon
        source={iconSvg}
        style={{ alignSelf: "center", marginTop: 50 }}
      />
      <BrandText
        style={[{ alignSelf: "center", marginTop: 20 }, fontSemibold28]}
      >
        {title}
      </BrandText>
      <Separator style={{ width: 320, alignSelf: "center", marginTop: 50 }} />
    </View>
  );
};
