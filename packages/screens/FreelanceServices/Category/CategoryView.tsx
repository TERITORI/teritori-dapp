import React from "react";

import { CategoryHeader } from "../../../components/freelanceServices/Category/CategoryHeader";
import { CardsSection } from "../../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { getCards, getSubCategoryCards } from "../query/data";

type CategoryViewProps = {
  category: string;
};
export const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  const main_cat = getCards("explore_marketplace").find(
    (item) => item.name === category
  );
  return (
    <>
      {main_cat && (
        <>
          <CategoryHeader title={main_cat.title} iconSvg={main_cat.icon} />
          <CardsSection
            title={category}
            cards={getSubCategoryCards(category)}
          />
          <CardsSection
            title="Most Popular in Graphics & Design"
            cards={getSubCategoryCards(category)}
          />
        </>
      )}
    </>
  );
};
