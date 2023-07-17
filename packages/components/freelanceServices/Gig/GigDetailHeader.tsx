import React, { useState } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";

import { ReportPopUp } from "./PopUp/ReportPopUp";
import { SharePopup } from "./PopUp/SharePopup";
import heartIcon from "../../../../assets/icons/heart.svg";
import reportIcon from "../../../../assets/icons/report.svg";
import shareIcon from "../../../../assets/icons/share-white.svg";
import { GigData } from "../../../screens/FreelanceServices/types/fields";
import {
  neutral44,
  secondaryColor,
  neutral00,
  neutralA3,
  neutral33,
} from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

const tabs = [
  "Overview",
  "Description",
  "About the seller",
  "Portfolio",
  "Compare packages",
  "Reviews",
];

export const GigDetailHeader: React.FC<{
  data: GigData | null;
}> = ({ data }) => {
  const [selected, setSelected] = useState(tabs[0]);
  const [displayReportPopup, setDisplayReportPopup] = useState(false);
  const [displaySharePopup, setDisplaySharePopup] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        width: "100%",
        marginTop: 30,
        borderBottomColor: neutral44,
        borderBottomWidth: 1,
        flexDirection: width > 1024 ? "row" : "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {displayReportPopup && (
        <ReportPopUp
          seller={data?.sellerAddress!}
          visible={displayReportPopup}
          onClose={() => {
            setDisplayReportPopup(false);
          }}
        />
      )}
      {displaySharePopup && (
        <SharePopup
          visible={displaySharePopup}
          onClose={() => {
            setDisplaySharePopup(false);
          }}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: "fit-content",
        }}
      >
        {tabs.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelected(item);
            }}
          >
            <BrandText
              style={[
                {
                  borderBottomColor:
                    selected === item ? secondaryColor : neutral00,
                  borderBottomWidth: 2,
                  paddingBottom: width > 1024 ? "12" : "5",
                  marginBottom: width > 1024 ? 0 : 10,
                  width: "fit-content",
                  marginRight: 20,
                },
                fontMedium14,
              ]}
            >
              {item}
            </BrandText>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          height: "100%",
          marginBottom: width > 1024 ? 2 : layout.padding_x1,
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <TouchableOpacity>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <SVG
                source={heartIcon}
                width={24}
                height={24}
                fill={data && data.isFavorite ? "red" : "none"}
              />
              <BrandText
                style={[fontMedium14, { color: neutralA3, marginLeft: 12 }]}
              >
                {data && data.reviews?.stats.total}
              </BrandText>
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: 24,
              borderColor: neutral33,
              borderWidth: 0.5,
              transform: [{ rotate: "90deg" }],
            }}
          />
        </View>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setDisplayReportPopup(true);
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <SVG source={reportIcon} width={24} height={24} />
              <BrandText
                style={[fontMedium14, { color: neutralA3, marginLeft: 12 }]}
              >
                Report
              </BrandText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <View
            style={{
              width: 24,
              borderColor: neutral33,
              borderWidth: 0.5,
              transform: [{ rotate: "90deg" }],
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setDisplaySharePopup(true);
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <SVG source={shareIcon} width={24} height={24} />
              <BrandText
                style={[fontMedium14, { color: neutralA3, marginLeft: 12 }]}
              >
                Share
              </BrandText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
