import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import chevronUp from "../../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../../assets/icons/freelance-service/chevron-down.svg";
import star from "../../../../../assets/icons/yellow-star.svg";
import { ReviewFields } from "../../../../screens/FreelanceServices/types/fields";
import {
  secondaryColor,
  yellowDefault,
  neutral77,
  neutral33,
  neutralA3,
} from "../../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold20,
  fontSemibold16,
  fontSemibold14,
} from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { SVG } from "../../../SVG";
import { StarRating } from "../../StarRating";

export const ReviewsStats: React.FC<{ reviews: ReviewFields[] }> = ({
  reviews,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={{ flexDirection: "column", marginTop: 30, marginBottom: 30 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText style={[fontSemibold20, { marginRight: 12 }]}>
            40,546 Reviews
          </BrandText>
          <StarRating rating={4.9} />
          <BrandText
            style={[{ color: yellowDefault, marginLeft: 12 }, fontMedium14]}
          >
            4.9
          </BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText
            style={[fontSemibold16, { color: neutral77, marginRight: 8 }]}
          >
            Sort by
          </BrandText>
          <BrandText
            style={[fontSemibold16, { color: secondaryColor, marginRight: 8 }]}
          >
            Most Relevant
          </BrandText>
          <TouchableOpacity
            onPress={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <SVG source={chevronDown} width={16} height={16} />
            ) : (
              <SVG source={chevronUp} width={16} height={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 500 }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginRight: 12 }]}
          >
            5 stars
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
              style={{ height: "100%", width: "80%", borderRadius: 24 }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 12 }]}
          >
            (36,543)
          </BrandText>
        </View>
        <BrandText style={[fontSemibold16, { color: neutral77 }]}>
          Rating Breakdown
        </BrandText>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 500 }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginRight: 12 }]}
          >
            4 stars
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
              style={{ height: "100%", width: "20%", borderRadius: 6 }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 12 }]}
          >
            (36,543)
          </BrandText>
        </View>
        <View
          style={{
            width: 250,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Seller communication level
          </BrandText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SVG source={star} width={24} height={24} />
            <BrandText
              style={[{ color: yellowDefault, marginLeft: 4 }, fontMedium14]}
            >
              4.9
            </BrandText>
          </View>
        </View>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 500 }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginRight: 12 }]}
          >
            3 stars
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
              style={{ height: "100%", width: "20%", borderRadius: 6 }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 12 }]}
          >
            (36,543)
          </BrandText>
        </View>
        <View
          style={{
            width: 250,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Recommend to a friend
          </BrandText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SVG source={star} width={24} height={24} />
            <BrandText
              style={[{ color: yellowDefault, marginLeft: 4 }, fontMedium14]}
            >
              4.9
            </BrandText>
          </View>
        </View>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 500 }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginRight: 12 }]}
          >
            2 stars
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
              style={{ height: "100%", width: "20%", borderRadius: 6 }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 12 }]}
          >
            (36,543)
          </BrandText>
        </View>
        <View
          style={{
            width: 250,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Service as described
          </BrandText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SVG source={star} width={24} height={24} />
            <BrandText
              style={[{ color: yellowDefault, marginLeft: 4 }, fontMedium14]}
            >
              4.9
            </BrandText>
          </View>
        </View>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 500 }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginRight: 15 }]}
          >
            1 stars
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
              style={{ height: "100%", width: "20%", borderRadius: 6 }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 12 }]}
          >
            (36,543)
          </BrandText>
        </View>
      </View>
    </View>
  );
};
