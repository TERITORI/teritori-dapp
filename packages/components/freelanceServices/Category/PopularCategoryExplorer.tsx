import { View, TouchableOpacity } from "react-native";

import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import subcat from "../../../screens/FreelanceServices/basedata/subcat.json";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";
type PopularCategoryExplorerProps = {
  category: string;
};
export const PopularCategoryExplorer: React.FC<
  PopularCategoryExplorerProps
> = ({ category }) => {
  //@ts-ignore
  const subcategoris = subcat[category];
  return (
    <View style={{ flexDirection: "column", width: 1290, alignSelf: "center" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 60,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText>Most Popular in Graphics & Design</BrandText>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity>
            <SVG
              source={chevronLeft}
              width={18}
              height={18}
              style={{ marginRight: layout.padding_x1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <SVG source={chevronRight} width={18} height={18} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignSelf: "center",
          width: "100%",
          marginTop: layout.padding_x2_5,
          justifyContent: "space-between",
        }}
      >
        {subcategoris.map((item: any, index: number) => (
          <FreelanceServicesCards
            iconSVG={item.icon}
            text={item.title}
            width={242}
            height={156}
            key={index}
            category={category}
            subCategory={item.name}
          />
        ))}
      </View>
    </View>
  );
};
