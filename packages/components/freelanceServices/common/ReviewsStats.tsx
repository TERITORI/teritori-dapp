import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { StarRating } from "./StarRating";
import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import star from "../../../../assets/icons/yellow-star.svg";
import {
  secondaryColor,
  yellowDefault,
  neutral77,
  neutral33,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold20,
  fontSemibold16,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { ReviewFields } from "../types/fields";

const PerStarRatingDetail: React.FC<{
  star: number;
  stats: ReviewFields["stats"];
}> = ({ star, stats }) => {
  const percentage = `${(stats.starsCount[star - 1] * 100) / stats.total}%`;
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <BrandText
        style={[fontSemibold16, { color: neutralA3, marginRight: 12 }]}
      >
        {star} stars
      </BrandText>
      <View
        style={{
          width: 284,
          height: 6,
          borderRadius: 6,
          backgroundColor: neutral33,
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: "100%", width: percentage, borderRadius: 24 }}
          colors={["#5433FF", "#20BDFF", "#A5FECB"]}
        />
      </View>
      <BrandText style={[fontSemibold16, { color: neutralA3, marginLeft: 12 }]}>
        ({stats.starsCount[star - 1]})
      </BrandText>
    </View>
  );
};

const RatingBreakdownItem: React.FC<{
  text: string;
  value: number;
}> = ({ text, value }) => (
  <View
    style={{
      width: 250,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <BrandText style={[fontSemibold14, { color: neutral77 }]}>{text}</BrandText>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SVG source={star} width={24} height={24} />
      <BrandText
        style={[{ color: yellowDefault, marginLeft: 4 }, fontMedium14]}
      >
        {value.toFixed(1)}
      </BrandText>
    </View>
  </View>
);

export const ReviewsStats: React.FC<{ reviews: ReviewFields }> = ({
  reviews,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={{ flexDirection: "column", marginTop: 30, marginBottom: 30 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText style={[fontSemibold20, { marginRight: 12 }]}>
            {reviews.stats.total} Reviews
          </BrandText>
          <StarRating rating={reviews.stats.avgRating.total} />
          <BrandText
            style={[{ color: yellowDefault, marginLeft: 12 }, fontMedium14]}
          >
            {reviews.stats.avgRating.total}
          </BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[fontSemibold16, { color: neutral77, marginRight: 8 }]}
          >
            Sort by
          </BrandText>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              setIsOpen(!isOpen);
            }}
          >
            <BrandText
              style={[
                fontSemibold16,
                { color: secondaryColor, marginRight: 8 },
              ]}
            >
              Most Relevant
            </BrandText>

            {isOpen ? (
              <SVG source={chevronUp} width={16} height={16} />
            ) : (
              <SVG source={chevronDown} width={16} height={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            height: 125,
            justifyContent: "space-between",
          }}
        >
          <PerStarRatingDetail stats={reviews.stats} star={5} />
          <PerStarRatingDetail stats={reviews.stats} star={4} />
          <PerStarRatingDetail stats={reviews.stats} star={3} />
          <PerStarRatingDetail stats={reviews.stats} star={2} />
          <PerStarRatingDetail stats={reviews.stats} star={1} />
        </View>
        <View
          style={{
            flexDirection: "column",
            // height: "100%",
            justifyContent: "space-between",
          }}
        >
          <BrandText
            style={[
              fontSemibold16,
              { color: neutral77, marginBottom: layout.padding_x1 },
            ]}
          >
            Rating Breakdown
          </BrandText>
          <RatingBreakdownItem
            text="Seller communication level"
            value={reviews.stats.avgRating.communication}
          />
          <RatingBreakdownItem
            text="Recommend to a friend"
            value={reviews.stats.avgRating.recommendToFriend}
          />
          <RatingBreakdownItem
            text="Service as described"
            value={reviews.stats.avgRating.serviceAsDescribed}
          />
        </View>
      </View>
    </View>
  );
};
