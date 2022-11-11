import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { ExplorerMarketPlace } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { FreelancersProjects } from "../../components/freelanceServices/FreelanceServicesScreen/FreelancersProjects";
import { FreelanceServiceProfessionalOverview } from "../../components/freelanceServices/FreelanceServicesScreen/ProfessionalServicesOverview";

export const FreelanceServicesScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <FreelanceServicesHeader />
      <ExplorerMarketPlace />
      <FreelanceServiceProfessionalOverview />
      <FreelancersProjects />
    </ScreenContainer>
  );
};
