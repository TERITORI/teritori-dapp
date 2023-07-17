import Checkbox from "expo-checkbox";
import React from "react";
import { FlatList, Image, ImageBackground, View } from "react-native";

import checkIcon from "../../../../assets/icons/blue-check.svg";
import { TopRatedSeller } from "../../../screens/FreelanceServices/SellersDetails/components/TopRatedSeller";
import { GigData } from "../../../screens/FreelanceServices/types/fields";
import {
  neutral00,
  neutral33,
  neutral77,
  primaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { StarRating } from "../common/StarRating";

function SelectedExtra(props: { item: any }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        width: 220,
        marginBottom: layout.padding_x1,
      }}
    >
      <SVG
        source={checkIcon}
        width={16}
        height={16}
        style={{ marginRight: 12 }}
      />
      <BrandText
        style={[fontSemibold14, { color: neutral77, marginRight: 24 }]}
      >
        {props.item.text}
      </BrandText>
    </View>
  );
}

export const FirstStep: React.FC<{
  gigData: GigData;
  serviceLevelIndex: number;
  selected: Set<number>;
  setSelected: (value: Set<number>) => void;
}> = ({ gigData, serviceLevelIndex, selected, setSelected }) => {
  return (
    <View style={{ width: 840 }}>
      <View style={{ flexDirection: "row", marginTop: 24, display: "flex" }}>
        <ImageBackground
          source={gigData.sellerUser.backgroundPic}
          style={{ width: 148, height: 148 }}
        />
        <View style={{ padding: 20 }}>
          <BrandText style={[fontSemibold28]}>{gigData.title}</BrandText>
          <BrandText style={[fontSemibold16, { marginTop: 12 }]}>
            {gigData.price.value} {gigData.price.currency}
          </BrandText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Image
              // @ts-ignore
              source={gigData.sellerUser.profilePic}
              style={{ width: 32, height: 32, marginRight: 12 }}
            />
            <BrandText style={[fontMedium14, { marginRight: 12 }]}>
              @{gigData.sellerUser.username}
            </BrandText>
            <TopRatedSeller rating={gigData.sellerUser.rating} />
            <View
              style={{
                width: 24,
                borderColor: neutral33,
                borderWidth: 0.5,
                transform: [{ rotate: "90deg" }],
              }}
            />
            <StarRating rating={gigData.sellerUser.rating} />
            <BrandText
              style={[{ color: yellowDefault, marginRight: 12 }, fontMedium14]}
            >
              {gigData.sellerUser.rating}
            </BrandText>
            <BrandText style={[{ color: neutral77 }, fontMedium14]}>
              ({gigData.reviews?.stats.total})
            </BrandText>
            <View
              style={{
                width: 24,
                borderColor: neutral33,
                borderWidth: 0.5,
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: neutral33,
          marginTop: 24,
        }}
      />
      <BrandText style={[fontSemibold16, { marginTop: 24 }]}>
        What's included
      </BrandText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
        }}
      >
        <FlatList
          data={gigData.serviceLevels[serviceLevelIndex].extras.filter(
            (element, index) => selected.has(index)
          )}
          numColumns={4}
          renderItem={({ item }) => <SelectedExtra item={item} />}
          keyExtractor={(item) => item.text}
        />
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: neutral33,
          marginTop: 24,
          marginBottom: 24,
        }}
      />
      <BrandText style={[fontSemibold20]}>
        Upgrade your order with extras
      </BrandText>
      {gigData.serviceLevels[serviceLevelIndex].extras.map(
        (item, index: number) => (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 24,
                justifyContent: "space-between",
                width: "800px",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Checkbox
                  style={{
                    borderColor: neutral33,
                    borderWidth: 1,
                    width: 24,
                    height: 24,
                    marginRight: 24,
                  }}
                  color={selected.has(index) ? primaryColor : neutral00}
                  value={selected.has(index)}
                  onValueChange={(value) => {
                    if (value) {
                      selected.add(index);
                    } else {
                      selected.delete(index);
                    }
                    setSelected(new Set([...selected]));
                  }}
                />
                <BrandText
                  style={[fontSemibold16, { height: 24, lineHeight: 24 }]}
                >
                  {item.text}
                </BrandText>
              </View>
              <BrandText style={[fontSemibold16]}>
                {item.price.value} {item.price.currency}
              </BrandText>
            </View>
            <BrandText
              style={[
                fontSemibold14,
                { color: neutral77, marginTop: 6, marginLeft: 48 },
              ]}
            >
              {item.description}
            </BrandText>
          </View>
        )
      )}
    </View>
  );
};
