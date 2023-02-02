import React from "react";
import { View, TouchableOpacity } from "react-native";

import chevronLeft from "../../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../../assets/icons/chevron-right.svg";
import { getServiceListing } from "../../../../screens/FreelanceServices/query/data";
import { fontSemibold20 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { ServiceCard } from "../../Cards/ServiceCard";

const data = getServiceListing();

export const DisplayMoreServices: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        marginTop: 30,
        marginBottom: 30,
        width: 1270,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BrandText style={fontSemibold20}>
          More Services by @{data[0].user.username}
        </BrandText>
        {data.length > 4 ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity>
              <SVG source={chevronLeft} width={16} height={16} />
            </TouchableOpacity>
            <TouchableOpacity>
              <SVG source={chevronRight} width={16} height={16} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        {data.map((item, index) => (
          <ServiceCard key={index} width={306} height={336} data={item} />
        ))}
      </View>
    </View>
  );
};
