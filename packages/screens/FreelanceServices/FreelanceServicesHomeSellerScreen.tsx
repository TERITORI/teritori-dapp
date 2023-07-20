import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { FreelanceCommunity } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceCommunity";
import { FreelanceServicesSellerHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesSellerHeader";
import { ScreenFC } from "../../utils/navigation";

export const FreelanceServicesHomeSellerScreen: ScreenFC<
  "FreelanceServicesHomeSeller"
> = () => {
  return (
    <ScreenContainer fullWidth noMargin>
      <FreelanceServicesSellerHeader />
      <FreelanceCommunity />
    </ScreenContainer>
  );
};
