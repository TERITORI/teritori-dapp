import React from "react";

// import { Gallery, getGallery } from "./query/getGallery";
import { getCategories } from "./query/data";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ExplorerMarketPlace } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { PopularProfessionalServices } from "../../components/freelanceServices/FreelanceServicesScreen/PopularProfessionalServices";
import { ScreenFC } from "../../utils/navigation";

export const FreelanceServicesHomeBuyerScreen: ScreenFC<
  "FreelanceServicesHomeBuyer"
> = () => {
  return (
    <ScreenContainer fullWidth noMargin>
      <FreelanceServicesHeader />
      <ExplorerMarketPlace category={getCategories()["explore_marketplace"]} />
      <PopularProfessionalServices />
    </ScreenContainer>
  );
};
