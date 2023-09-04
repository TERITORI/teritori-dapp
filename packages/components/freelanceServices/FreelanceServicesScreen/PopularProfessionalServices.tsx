import { TouchableOpacity, View } from "react-native";

import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import maincat from "../../../screens/FreelanceServices/basedata/maincat.json";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CutOffCard } from "../Cards/CutOffCard";

export const PopularProfessionalServices: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: leftMarginMainContent,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 40,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText>Popular Professional Services</BrandText>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity>
            <SVG
              source={chevronLeft}
              width={18}
              height={18}
              style={{ marginRight: layout.spacing_x1 }}
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
          marginTop: layout.spacing_x2_5,
          justifyContent: "space-between",
        }}
      >
        {maincat["popular_professional_services"].map((item, index) => (
          <CutOffCard
            width={240}
            height={280}
            title={item.title}
            imageBackground={item.icon}
            key={index}
          />
        ))}
      </View>
    </View>
  );
};
