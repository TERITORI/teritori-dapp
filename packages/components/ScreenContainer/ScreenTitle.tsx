import { TextProps } from "react-native";

import { BrandText } from "../BrandText";

import { fontRegular15 } from "@/utils/style/fonts";

export const ScreenTitle: React.FC<TextProps> = (props) => {
  return (
    <BrandText style={[fontRegular15, props.style]}>{props.children}</BrandText>
  );
};
