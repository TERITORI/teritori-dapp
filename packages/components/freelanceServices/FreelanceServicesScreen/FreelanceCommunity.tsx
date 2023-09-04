import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import CreateGigSvg from "../../../../assets/icons/freelance-service/CreateGig.svg";
import DeliverSvg from "../../../../assets/icons/freelance-service/Deliver.svg";
import GetPaidSvg from "../../../../assets/icons/freelance-service/GetPaid.svg";
import maincat from "../../../screens/FreelanceServices/basedata/maincat.json";
// import { FreelancerServiceRouteTypes } from "../../../screens/FreelanceServices/types/routes";
import { neutral17, neutral33, neutral77 } from "../../../utils/style/colors";
import { fontMedium14, fontSemibold14 } from "../../../utils/style/fonts";
import { layout, leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { FreelanceServicesCards } from "../Cards/FreelanceServicesCards";
// const data = [
//   {
//     name: "I am a Designer",
//     icon: Feather,
//     iconChangePage: GoToPageIcon,
//     category: "GraphicsAndDesign",
//   },
//   {
//     name: "I am a Marketer",
//     icon: Computer,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
//   {
//     name: "I am a Writer",
//     icon: Pen,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
//   {
//     name: "I am a Video Editor",
//     icon: BallBounce,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
//   {
//     name: "I am a Musician",
//     icon: Music,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
//   {
//     name: "I am a Developer",
//     icon: Code,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
//   {
//     name: "I am an Entrepreneur",
//     icon: Suitcase,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
//   {
//     name: "Another Skill",
//     icon: Data,
//     iconChangePage: GoToPageIcon,
//     category: "ComingSoon",
//   },
// ] as FreelancerServiceRouteTypes[];

export const FreelanceCommunity: React.FC = () => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "column",
        alignSelf: "center",
        width: "100%",
        paddingHorizontal: leftMarginMainContent,
        justifyContent: "flex-start",
      }}
    >
      <BrandText style={{ alignSelf: "center", width: "100%", marginTop: 40 }}>
        Join our freelance community
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: width > 1280 ? "flex-start" : "center",
          alignSelf: "center",
          width: "100%",
          marginTop: layout.spacing_x2_5,
        }}
      >
        {maincat["freelance_community"].map((item, index) => (
          <FreelanceServicesCards
            iconSVG={item.icon}
            text={item.title}
            width={width > 1024 ? 242 : 170}
            height={156}
            boxStyle={{
              justifyContent: width > 1280 ? "flex-start" : "center",
              marginRight: layout.spacing_x2,
              marginTop: layout.spacing_x2,
            }}
            key={index}
            category={item.name}
          />
        ))}
      </View>
      <View style={{ marginTop: 40, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <BrandText>How it works</BrandText>
        </View>
        <View style={{ flex: 3, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.svg}>
                <SVG source={CreateGigSvg} />
              </View>
              <Separator
                style={{ flex: 1, alignSelf: "center", marginHorizontal: 20 }}
              />
            </View>
            <View style={{ flexDirection: "column", marginTop: 10 }}>
              <BrandText style={fontSemibold14}>1. Create a Gig</BrandText>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <BrandText
                  style={[fontMedium14, { flex: 3, color: neutral77 }]}
                >
                  Register without any charges, create your Gig, and present our
                  services to our worldwide audience
                </BrandText>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.svg}>
                <SVG source={DeliverSvg} />
              </View>
              <Separator
                style={{ flex: 1, alignSelf: "center", marginHorizontal: 20 }}
              />
            </View>
            <View style={{ flexDirection: "column", marginTop: 10 }}>
              <BrandText style={fontSemibold14}>
                2. Deliver great work
              </BrandText>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <BrandText
                  style={[fontMedium14, { flex: 3, color: neutral77 }]}
                >
                  Receive Alerts upon receiving an order and utilize our
                  platform to communicate and discuss specifics with your
                  clients
                </BrandText>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.svg}>
                <SVG source={GetPaidSvg} />
              </View>
            </View>
            <View style={{ flexDirection: "column", marginTop: 10 }}>
              <BrandText style={fontSemibold14}>3. Get paid</BrandText>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <BrandText
                  style={[fontMedium14, { flex: 3, color: neutral77 }]}
                >
                  Get paid punctually and consistently. Once the payment is
                  cleared, it becoms available for withdrawal.
                </BrandText>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  svg: {
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: neutral17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: neutral33,
  },
});
