import React from "react";

import { FreelanceScreenBase } from "./FreelanceScreenBase";
import { getCards } from "./query/data";
import { CardsSection } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { ScreenFC } from "../../utils/navigation";

export const FreelanceServicesHomeBuyerScreen: ScreenFC<
  "FreelanceServicesHomeBuyer"
> = () => {
  return (
    <FreelanceScreenBase>
      <FreelanceServicesHeader />
      <CardsSection
        title="Explore the Marketplace"
        cards={getCards("explore_marketplace")}
      />

      <CardsSection
        title="Popular Professional Services"
        cards={getCards("popular_professional_services")}
      />
    </FreelanceScreenBase>
  );
};
