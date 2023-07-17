import React from "react";

import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { Gallery, getGallery } from "./query/getGallery";
import { ExplorerMarketPlace } from "../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { FreelanceServicesHeader } from "../../components/freelanceServices/FreelanceServicesScreen/FreelanceServicesHeader";
import { GenericGallery } from "../../components/freelanceServices/FreelanceServicesScreen/GenericGallery";
import { ScreenFC } from "../../utils/navigation";

const galleries: Gallery[] = [
  getGallery("popular-services"),
  getGallery("freelancer-featured"),
];
export const FreelanceServicesHomeBuyer: ScreenFC<
  "FreelanceServicesHomeBuyer"
> = () => {
  return (
    <FreelanceServicesScreenWrapper showBuyerSeller>
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
