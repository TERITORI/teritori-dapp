import React from "react";

import { ListGigs } from "../../../components/freelanceServices/Category/ListGigs";
import { SubCategoryHeader } from "../../../components/freelanceServices/Category/SubCategoryHeader";
import { SubCategoryMenu } from "../../../components/freelanceServices/Category/SubCategoryMenu";
import maincat from "../basedata/maincat.json";
import subcat from "../basedata/subcat.json";

type SubCategoryViewProps = {
  category: string;
  subcategory: string;
};
export const SubCategoryView: React.FC<SubCategoryViewProps> = ({
  category,
  subcategory,
}) => {
  const main_cat = maincat["explore_marketplace"].find(
    (item) => item.name === category
  );
  //@ts-ignore
  const sub_cat = subcat[main_cat?.name].find(
    //@ts-ignore
    (item) => item.name === subcategory
  );
  return (
    <>
      <SubCategoryHeader title={sub_cat.title} iconSvg={sub_cat.icon} />
      <SubCategoryMenu />
      <ListGigs category={category} subcategory={subcategory}/>
    </>
  );
};
