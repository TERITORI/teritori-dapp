import React from "react";

import { CategoryHeader } from "../../../components/freelanceServices/Category/CategoryHeader";
import { PopularCategoryExplorer } from "../../../components/freelanceServices/Category/PopularCategoryExplorer";
import maincat from "../../../screens/FreelanceServices/basedata/maincat.json";
type CategoryViewProps = {
  category: string;
};
export const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  // const gallery = getGallery("graphic-and-design-page");
  const main_cat = maincat["explore_marketplace"].find(
    (item) => item.name === category
  );
  return (
    <>
      {main_cat && (
        <>
          <CategoryHeader title={main_cat.title} iconSvg={main_cat.icon} />
          <PopularCategoryExplorer category={main_cat.name} />
        </>
      )}
    </>
  );
};
