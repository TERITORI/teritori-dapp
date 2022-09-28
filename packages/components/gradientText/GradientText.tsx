import { TextStyle } from "react-native";

import { BrandText } from "../BrandText";

export const GradientText: React.FC<{ style: TextStyle }> = ({ children }) => (
  <BrandText>{children}</BrandText>
);
