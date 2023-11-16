import React from "react";

import { FreelanceScreenBase } from "./FreelanceScreenBase";
import { FreelanceCommunity } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceCommunity";
import { FreelanceServicesSellerHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesSellerHeader";
import { ScreenFC } from "../../utils/navigation";

export const FreelanceServicesHomeSellerScreen: ScreenFC<
  "FreelanceServicesHomeSeller"
> = () => {
  return (
    <FreelanceScreenBase>
      <FreelanceServicesSellerHeader />
      <FreelanceCommunity />
    </FreelanceScreenBase>
  );
};
