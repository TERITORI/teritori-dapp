import React from "react";

import { FreelanceCommunity } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceCommunity";
import { FreelanceServicesSellerHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesSellerHeader";
import { ScreenFC } from "../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";

export const FreelanceServicesHomeSeller: ScreenFC<
  "FreelanceServicesHomeSeller"
> = () => {
  return (
    <FreelanceServicesScreenWrapper showBuyerSeller isBuyer={false}>
      <FreelanceServicesSellerHeader />
      <FreelanceCommunity />
    </FreelanceServicesScreenWrapper>
  );
};
