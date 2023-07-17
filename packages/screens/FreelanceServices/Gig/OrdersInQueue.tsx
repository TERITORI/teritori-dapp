import React from "react";

import { BrandText } from "../../../components/BrandText";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";

export const OrdersInQueue: React.FC<{ totalQueue: number }> = ({
  totalQueue,
}) => {
  return totalQueue > 0 ? (
    <BrandText style={[{ color: neutral77 }, fontMedium14]}>
      {totalQueue} Orders in Queue
    </BrandText>
  ) : null;
};
