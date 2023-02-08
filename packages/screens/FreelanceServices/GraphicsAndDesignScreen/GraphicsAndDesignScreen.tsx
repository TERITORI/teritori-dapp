import React from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { GenericGallery } from "../../../components/freelanceServices/FreelanceServicesScreen/GenericGallery";
import { GraphicsAndDesignHeader } from "../../../components/freelanceServices/GraphicsAndDesign/Header";
import { PopularDesignExplorer } from "../../../components/freelanceServices/GraphicsAndDesign/PopularDesignExplorer";
import { getGallery } from "../query/getGallery";

export const GraphicsAndDesignScreen: React.FC = () => {
  const gallery = getGallery("graphic-and-design-page");
  return (
    <ScreenContainer>
      <GraphicsAndDesignHeader />
      <PopularDesignExplorer />
      <GenericGallery
        header={gallery.header}
        cards={gallery.cards}
        cardsToShow={gallery.cardsToShow}
      />
    </ScreenContainer>
  );
};
