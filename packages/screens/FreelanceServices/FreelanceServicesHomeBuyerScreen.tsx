import React from "react";

import { Gallery, getGallery } from "./query/getGallery";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ExplorerMarketPlace } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { GenericGallery } from "../../components/freelanceServices/FreelanceServicesScreen/GenericGallery";
import { ScreenFC } from "../../utils/navigation";

const galleries: Gallery[] = [
  getGallery("popular-services"),
  getGallery("freelancer-featured"),
];
export const FreelanceServicesHomeBuyerScreen: ScreenFC<
  "FreelanceServicesHomeBuyer"
> = () => {
  return (
    <ScreenContainer fullWidth noMargin>
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
