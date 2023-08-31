import React from "react";
import { View, useWindowDimensions } from "react-native";

import { GrantTag } from "./components/GrantTag";
import { TaskItem } from "./components/TaskItem";
import { TaskList } from "./components/TaskList";
import discordSVG from "../../../assets/icons/discord.svg";
import githubSVG from "../../../assets/icons/github.svg";
import grantsCompletedSVG from "../../../assets/icons/grants-completed.svg";
import grantsInProgressSVG from "../../../assets/icons/grants-inProgress.svg";
import grantsOpenSVG from "../../../assets/icons/grants-open.svg";
import grantsReviewSVG from "../../../assets/icons/grants-review.svg";
import gnoSVG from "../../../assets/icons/networks/gno.svg";
import shareSVG from "../../../assets/icons/share.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SimpleButton } from "../../components/buttons/SimpleButton";
import { SocialButton } from "../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { ScreenFC } from "../../utils/navigation";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const GrantsProgramDetailScreen: ScreenFC<
  "GrantsProgramDetail"
> = () => {
  return (
    <ScreenContainer
      isLarge
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>Grants Program Detail</BrandText>
      }
    >
      <FlexRow
        style={{
          marginTop: layout.padding_x4,
          justifyContent: "space-between",
        }}
      >
        {/* Left block ======================================================= */}
        <View style={{ flex: 1 }}>
          <FlexRow>
            <RoundedGradientImage size="L" square sourceURI="" />

            <View style={{ marginHorizontal: layout.padding_x2, flex: 1 }}>
              <BrandText style={fontSemibold20}>
                Create a web Game using Gnolang
              </BrandText>

              <BrandText
                style={[
                  fontSemibold13,
                  {
                    color: neutralA3,
                    marginTop: layout.padding_x2,
                  },
                ]}
              >
                Grant name Learning Groups onboard strong technical specialists
                (engineers, lorem ipsum, researchers, open-source developers,
                and more) into the lorem ipsum dolor sit is Live, $50,000 lorem
                ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum
                dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit
                amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem
                ipsum dolor sit amet lorem ipsum.
              </BrandText>

              <SpacerColumn size={2} />

              <TertiaryBox
                noBrokenCorners
                mainContainerStyle={{
                  backgroundColor: neutral22,
                  borderWidth: 0,
                  padding: layout.padding_x1_5,
                }}
              >
                <FlexRow style={{ justifyContent: "center", width: "100%" }}>
                  <SVG source={gnoSVG} width={18} height={18} />
                  <BrandText
                    style={[
                      fontSemibold13,
                      { marginLeft: layout.padding_x1_5 },
                    ]}
                  >
                    @0x17dfsdvgsd98fsbsd9b8sd
                  </BrandText>
                </FlexRow>
              </TertiaryBox>
            </View>
          </FlexRow>

          <SpacerColumn size={2} />

          <FlexRow>
            <SimpleButton
              text="Open"
              size="SM"
              bgColor="#C8FFAE1A"
              color="#C8FFAE"
              style={{ borderWidth: 0 }}
            />

            <SpacerRow size={2} />

            <GrantTag
              text="2005.12.4"
              size="M"
              containerStyle={{ marginRight: layout.padding_x2 }}
            />
            <GrantTag
              text="dapp"
              size="M"
              containerStyle={{ marginRight: layout.padding_x2 }}
            />
            <GrantTag
              text="Structure"
              size="M"
              containerStyle={{ marginRight: layout.padding_x2 }}
            />
          </FlexRow>
        </View>

        {/* Right block ======================================================= */}
        <View>
          <TertiaryBox
            noBrokenCorners
            mainContainerStyle={{
              backgroundColor: neutral22,
              borderWidth: 0,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: 224,
            }}
          >
            <FlexRow style={{ justifyContent: "center", width: "100%" }}>
              <BrandText style={[fontSemibold20, { color: neutral77 }]}>
                Grant:
              </BrandText>
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold20, { color: primaryColor }]}>
                $50K
              </BrandText>
            </FlexRow>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <View style={{ backgroundColor: neutral22 }}>
            <SocialButton
              text="Share URL"
              iconSvg={shareSVG}
              iconColor={secondaryColor}
              textColor={neutralA3}
            />
            <SpacerRow size={1} />
            <SocialButton
              text="Discord URL"
              iconSvg={discordSVG}
              textColor={neutralA3}
            />
            <SpacerRow size={1} />
            <SocialButton
              text="Website URL"
              iconSvg={websiteSVG}
              textColor={neutralA3}
            />
            <SpacerRow size={1} />
            <SocialButton
              text="Github URL"
              iconSvg={githubSVG}
              textColor={neutralA3}
            />
            <SpacerRow size={1} />
            <SocialButton
              text="Twitter URL"
              iconSvg={twitterSVG}
              textColor={neutralA3}
            />
          </View>
        </View>
      </FlexRow>

      <SpacerColumn size={2} />

      {/* Tasks block ======================================================= */}
      <View
        style={{
          // NOTE: trick to get will width background on responsible/large ScreenContainer
          marginHorizontal: -140,
          paddingHorizontal: 140,
          backgroundColor: neutral17,
          paddingVertical: layout.padding_x3,
        }}
      >
        <FlexRow>
          <BrandText style={fontSemibold20}>All Tasks:</BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold20, { color: neutral77 }]}>
            7
          </BrandText>
        </FlexRow>

        <Separator
          color={neutral33}
          style={{
            marginBottom: layout.padding_x2,
            marginTop: layout.padding_x3,
          }}
        />

        <FlexRow
          style={{
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <TaskList text="Open (Backlog)" count={4} iconSVG={grantsOpenSVG}>
            <TaskItem text="Community Docs Platform" priority="hight" />
          </TaskList>

          <SpacerRow size={3} />

          <TaskList text="In Progress" count={4} iconSVG={grantsInProgressSVG}>
            <TaskItem text="Community Docs Platform 1" priority="hight" />
            <TaskItem text="Community Docs Platform 2" priority="hight" />
            <TaskItem text="Community Docs Platform 3" priority="hight" />
          </TaskList>

          <SpacerRow size={3} />

          <TaskList text="Review" count={4} iconSVG={grantsReviewSVG}>
            <TaskItem
              text="Margin trading using the Platform Aggregation API"
              priority="medium"
            />
          </TaskList>

          <SpacerRow size={3} />

          <TaskList text="Completed" count={4} iconSVG={grantsCompletedSVG} />
        </FlexRow>
      </View>
    </ScreenContainer>
  );
};
