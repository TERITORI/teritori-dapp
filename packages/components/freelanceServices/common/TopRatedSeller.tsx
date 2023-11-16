import React from "react";

import { BrandText } from "../../../components/BrandText";
import { yellowDefault } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";

export const TopRatedSeller: React.FC<{ rating: number }> = ({ rating }) => {
  return rating > 4.5 ? (
    <BrandText style={[{ color: yellowDefault }, fontMedium14]}>
      Top Rated Seller
    </BrandText>
  ) : null;
};
