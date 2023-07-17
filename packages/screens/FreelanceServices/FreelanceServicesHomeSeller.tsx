import React from "react";

import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { FreelanceCommunity } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceCommunity";
import { FreelanceServicesSellerHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesSellerHeader";
import { ScreenFC } from "../../utils/navigation";

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
