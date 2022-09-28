import { StyleProp, TextStyle } from "react-native";

import { BrandText } from "../BrandText";

export const GradientText: React.FC<{ style: StyleProp<TextStyle> }> = ({
  children,
}) => <BrandText>{children}</BrandText>;
