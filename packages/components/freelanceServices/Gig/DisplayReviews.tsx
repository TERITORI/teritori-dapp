import React from "react";
import { Image, useWindowDimensions, View } from "react-native";

import {
  neutral33,
  neutral77,
  primaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { FlagIcon } from "../common/FlagIcon";
import { StarRating } from "../common/StarRating";
import { ReviewFields } from "../types/fields";

export const DisplayReviews: React.FC<{ reviews: ReviewFields["items"] }> = ({
  reviews,
}) => {
  const { width } = useWindowDimensions();
  return (
    <View style={{ flexDirection: "column", marginTop: 30, marginBottom: 30 }}>
      {reviews.map((item, index) => (
        <TertiaryBox fullWidth key={index} style={{ marginBottom: 12 }}>
          <View
            style={{
              marginTop: 12,
              marginBottom: 8,
              flexDirection: width < 1024 ? "column" : "row",
              justifyContent: "space-between",
              width: "95%",
              alignSelf: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                // @ts-ignore
                source={item.sellerUser.profilePic}
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <BrandText style={fontSemibold16}>
                @{item.sellerUser.username}
              </BrandText>
              <View
                style={{
                  width: 24,
                  height: 0,
                  borderColor: neutral33,
                  borderWidth: 0.5,
                  transform: [{ rotate: "90deg" }],
                }}
              />
              <FlagIcon alphaCode={item.sellerUser.country.alpha} />
              <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                {item.sellerUser.country.name}
              </BrandText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <StarRating rating={item.rating} />
              <BrandText
                style={[{ color: yellowDefault, marginLeft: 12 }, fontMedium14]}
              >
                {item.rating}
              </BrandText>
              <View
                style={{
                  width: 24,
                  height: 0,
                  borderColor: neutral33,
                  borderWidth: 0.5,
                  transform: [{ rotate: "90deg" }],
                }}
              />
              <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
                {item.date}
              </BrandText>
            </View>
          </View>
          <View style={{ width: "95%", marginBottom: 12 }}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {item.text}
            </BrandText>
            <BrandText
              style={[
                fontSemibold14,
                {
                  color: primaryColor,
                  borderBottomColor: primaryColor,
                  marginTop: 8,
                  borderBottomWidth: 0.5,
                  alignSelf: "flex-start",
                },
              ]}
            >
              See more
            </BrandText>
          </View>
        </TertiaryBox>
      ))}
      <SecondaryButton
        size="SM"
        text="See More"
        style={{ alignSelf: "center", marginTop: 12 }}
      />
    </View>
  );
};
