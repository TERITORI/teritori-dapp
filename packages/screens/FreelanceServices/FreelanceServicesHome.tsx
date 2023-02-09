import React from "react";

import { ExplorerMarketPlace } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { GenericGallery } from "../../components/freelanceServices/FreelanceServicesScreen/GenericGallery";
import { ScreenFC } from "../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { Gallery, getGallery } from "./query/getGallery";

const galleries: Gallery[] = [
  getGallery("popular-services"),
  getGallery("freelancer-featured"),
];
export const FreelanceServicesHome: ScreenFC<"FreelanceServicesHome"> = () => {
  return (
    <FreelanceServicesScreenWrapper>
      <FreelanceServicesHeader />
      <ExplorerMarketPlace />
      {galleries.map((gallery, index) => (
        <GenericGallery
          key={index}
          header={gallery.header}
          cards={gallery.cards}
          cardsToShow={gallery.cardsToShow}
        />
      ))}
    </FreelanceServicesScreenWrapper>
  );
};
