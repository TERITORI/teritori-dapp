import React from "react";
import { View, TouchableOpacity } from "react-native";

import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import { Gallery } from "../../../screens/FreelanceServices/query/getGallery";
import { neutral77, secondaryColor } from "../../../utils/style/colors";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CutOffCard } from "../Cards/CutOffCard";

export const GenericGallery: React.FC<Gallery> = ({
  cards,
  cardsToShow,
  header,
}) => {
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
        <BrandText>{header}</BrandText>
        {cards.length > cardsToShow ? (
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
        ) : null}
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
        {cards.map((item, index) => (
          <CutOffCard
            width={item?.descriptionTitle ? 300 : 240}
            height={item?.descriptionList ? 172 : 280}
            title={item.title}
            subtitle={item.subtitle}
            imageBackground={item.imageBackground}
            key={index}
            profilePic={item?.profilePic}
            //extra
            titleStyle={{
              color: item?.profilePic ? secondaryColor : neutral77,
            }}
            boxStyle={{
              marginTop: item?.descriptionTitle ? layout.padding_x2 : undefined,
            }}
            descriptionTitle={item?.descriptionTitle}
            descriptionList={item?.descriptionList}
          />
        ))}
      </View>
    </View>
  );
};
