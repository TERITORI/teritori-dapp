import React from "react";

import { CategoryHeader } from "../../../components/freelanceServices/Category/CategoryHeader";
import { PopularCategoryExplorer } from "../../../components/freelanceServices/Category/PopularCategoryExplorer";
import { ExplorerMarketPlace } from "../../../components/freelanceServices/FreelanceServicesScreen/ExploreMarketPlace";
import { getCategories } from "../query/data";

type CategoryViewProps = {
  category: string;
};
export const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  // const gallery = getGallery("graphic-and-design-page");
  const main_cat = getCategories()["explore_marketplace"].find(
    (item) => item.name === category
  );
  return (
    <>
      {main_cat && (
        <>
          <CategoryHeader title={main_cat.title} iconSvg={main_cat.icon} />
          <ExplorerMarketPlace category={main_cat} />
          <PopularCategoryExplorer category={main_cat.name} />
        </>
      )}
    </>
  );
};
