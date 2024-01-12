import React from "react";
import {
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from "react-native";

import { ApplicationCard } from "./component/ApplicationCard";
import { ApplicationSocialCard } from "./component/ApplicationSocialCard";
import { CreatorInformation } from "./component/CreatorInformation";
import { InvestmentInformation } from "./component/InvestmentInformation";
import { ProjectInformation } from "./component/ProjectInformation";
import { TeamInformation } from "./component/TeamInformation";
import guardianPng from "../../../assets/default-images/guardian_profile.png";
import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { SecondaryBox } from "../../components/boxes/SecondaryBox";
import { useAppNavigation } from "../../utils/navigation";
import { primaryColor, primaryTextColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const dummyData = [
  { title: "Supply", value: "5000" },
  { title: "Price", value: "5 SOL" },
  { title: "Limit Buy", value: "5 by address" },
];

const applicationSocialData = [
  { icon: discordSVG, name: "Discord" },
  { icon: websiteSVG, name: "Website" },
  { icon: twitterSVG, name: "Twitter" },
];
const LG_BREAKPOINT = 1250;

export const ApplicationRewiewScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  return (
    <ScreenContainer
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Launchpad Applications</BrandText>
      }
      responsive
      onBackPress={() => navigation.goBack()}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: width >= LG_BREAKPOINT ? "row" : "column-reverse",
            alignItems: width >= LG_BREAKPOINT ? "flex-start" : "center",
            justifyContent: "center",
            marginTop: 72,
            paddingBottom: 40,
          }}
        >
          {/* ===== Left container */}
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{ alignSelf: "flex-start" }}>
              <TertiaryBadge size="SM" label="PENDING REVIEW" />
            </View>
            <BrandText style={[fontSemibold28, { marginTop: 24 }]}>
              Yellow Block Generation
            </BrandText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 10,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {dummyData?.map((item, index) => (
                <ApplicationCard rowData={item} key={index} />
              ))}
            </View>
            <View style={{ marginTop: 24 }}>
              <BrandText style={fontSemibold14}>
                For decades, the destruction of ecosystems and social relations
                has turned people into soulless robots. At the same time,
                inequality explodes every year and misery becomes the norm for
                the silent majority.
              </BrandText>
              <BrandText style={[fontSemibold14, { marginTop: 15 }]}>
                A minority of powerful & wealthy leaders, called the “The
                Legion'', have set up a technological & political system
                allowing them to continue to develop their wealth and safety.
              </BrandText>
              <BrandText style={fontSemibold14}>
                Of course this system only serves the happy few elite members of
                the society while the majority survives in an increasingly
                uncertain world.
              </BrandText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 24,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {applicationSocialData?.map((item, index) => (
                <ApplicationSocialCard socialData={item} key={index} />
              ))}
            </View>
            <TouchableOpacity>
              <SecondaryBox
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  backgroundColor: primaryColor,
                  marginTop: 32,
                  width: 146,
                }}
              >
                <BrandText
                  style={[fontSemibold14, { color: primaryTextColor }]}
                >
                  Approve
                </BrandText>
              </SecondaryBox>
            </TouchableOpacity>
          </View>
          {/* ===== Right container */}
          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}
          >
            <Image
              style={{
                width: 450,
                height: 450,
              }}
              source={guardianPng}
            />
          </View>
        </View>
        <View>
          <CreatorInformation />
          <ProjectInformation />
          <TeamInformation />
          <InvestmentInformation />
        </View>
      </View>
    </ScreenContainer>
  );
};
