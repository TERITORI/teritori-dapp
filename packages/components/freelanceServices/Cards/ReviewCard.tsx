import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";

import usFlag from "../../../../assets/banners/freelance-service/flags/us-flag.png";
import chevronLeft from "../../../../assets/icons/chevron-left.svg";
import chevronRight from "../../../../assets/icons/chevron-right.svg";
import { ReviewFields } from "../../../screens/FreelanceServices/types/fields";
import {
  neutral33,
  neutral77,
  yellowDefault,
  neutral00,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { StarRating } from "../StarRating";

export const ReviewCard: React.FC<{ reviews: ReviewFields["items"] }> = ({
  reviews,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentReview, setCurrentReview] = useState(reviews.at(currentIndex));
  const hasNext = (): boolean => {
    return currentIndex + 1 < reviews.length;
  };
  const hasPrevious = (): boolean => {
    return currentIndex - 1 >= 0;
  };

  return (
    <TertiaryBox fullWidth style={{ marginTop: 12 }}>
      <View style={{ width: "100%", height: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            disabled={!hasPrevious()}
            style={{
              opacity: !hasPrevious() ? 0.5 : 1,
            }}
            onPress={() => {
              setCurrentIndex(currentIndex - 1);
              setCurrentReview(reviews.at(currentIndex));
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: neutral00,
                borderColor: neutral33,
                borderWidth: 0.5,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG source={chevronLeft} width={16} height={16} style={{}} />
            </View>
          </TouchableOpacity>
          {currentReview ? (
            <View style={{ flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Image
                  source={currentReview.user.profilePic}
                  style={{ width: 32, height: 32, marginRight: 8 }}
                />
                <BrandText style={fontSemibold14}>
                  @{currentReview.user.username}
                </BrandText>
                <View
                  style={{
                    width: 24,
                    borderColor: neutral33,
                    borderWidth: 0.5,
                    transform: [{ rotate: "90deg" }],
                  }}
                />
                <Image
                  source={usFlag}
                  style={{ width: 21, height: 15, marginRight: 8 }}
                />
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  {currentReview.user.country}
                </BrandText>
                <StarRating rating={currentReview.rating} />
                <BrandText
                  style={[
                    { color: yellowDefault, marginRight: 12 },
                    fontMedium14,
                  ]}
                >
                  {currentReview.rating}
                </BrandText>
              </View>
              <BrandText
                style={[fontMedium14, { color: neutral77, width: 500 }]}
              >
                {currentReview.text}
              </BrandText>
            </View>
          ) : (
            <></>
          )}
          <TouchableOpacity
            disabled={!hasNext()}
            style={{
              opacity: !hasNext() ? 0.5 : 1,
            }}
            onPress={() => {
              setCurrentIndex(currentIndex + 1);
              setCurrentReview(reviews.at(currentIndex));
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: neutral00,
                borderColor: neutral33,
                borderWidth: 0.5,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG source={chevronRight} width={16} height={16} style={{}} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TertiaryBox>
  );
};
