import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { ExplorerMarketPlace } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { GenericGallery } from "../../components/freelanceServices/FreelanceServicesScreen/GenericGallery";
import { Gallery, getGallery } from "./query/getGallery";

const galleries: Gallery[] = [
  getGallery("popular-services"),
  getGallery("freelancer-featured"),
];
export const FreelanceServicesScreen: React.FC = () => {
  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
};
