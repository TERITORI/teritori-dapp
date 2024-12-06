import { ReactNode } from "react";

import { BrandText } from "../BrandText";

import { fontRegular15 } from "@/utils/style/fonts";

export const ScreenTitle: React.FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <BrandText style={[fontRegular15, { maxWidth: 180 }]} numberOfLines={1}>
      {children}
    </BrandText>
  );
};
