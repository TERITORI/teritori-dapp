import React from "react";

import { FreelanceCommunity } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceCommunity";
import { FreelanceServicesSellerHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesSellerHeader";
import { ScreenFC } from "../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { Gallery, getGallery } from "./query/getGallery";

const galleries: Gallery[] = [
  getGallery("popular-services"),
  getGallery("freelancer-featured"),
];
export const FreelanceServicesHomeSeller: ScreenFC<"FreelanceServicesHomeSeller"> = () => {
  return (
    <FreelanceServicesScreenWrapper showBuyerSeller={true} isBuyer={false}>
      <FreelanceServicesSellerHeader />
      <FreelanceCommunity/>
    </FreelanceServicesScreenWrapper>
  );
};
