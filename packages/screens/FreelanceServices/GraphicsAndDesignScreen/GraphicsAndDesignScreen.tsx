import React from "react";

import { GenericGallery } from "../../../components/freelanceServices/FreelanceServicesScreen/GenericGallery";
import { GraphicsAndDesignHeader } from "../../../components/freelanceServices/GraphicsAndDesign/Header";
import { PopularDesignExplorer } from "../../../components/freelanceServices/GraphicsAndDesign/PopularDesignExplorer";
import { ScreenFC } from "../../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "../FreelanceServicesScreenWrapper";
import { getGallery } from "../query/getGallery";

export const GraphicsAndDesignScreen: ScreenFC<"GraphicsAndDesign"> = () => {
  const gallery = getGallery("graphic-and-design-page");
  return (
    <FreelanceServicesScreenWrapper>
      <GraphicsAndDesignHeader />
      <PopularDesignExplorer />
      <GenericGallery
        header={gallery.header}
        cards={gallery.cards}
        cardsToShow={gallery.cardsToShow}
      />
    </FreelanceServicesScreenWrapper>
  );
};
