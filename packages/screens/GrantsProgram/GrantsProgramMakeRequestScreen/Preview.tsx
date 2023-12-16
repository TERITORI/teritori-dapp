import React, { useState } from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import discordSVG from "../../../../assets/icons/discord.svg";
import githubSVG from "../../../../assets/icons/github.svg";
import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import { FlexRow } from "../../../components/FlexRow";
import { Link } from "../../../components/Link";
import { SVG } from "../../../components/SVG";
import { SearchBarInput } from "../../../components/Search/SearchBarInput";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { capitalize } from "../../../utils/text";
import { Tag } from "../components/Milestone";
import { MilestoneBoard } from "../components/MilestoneBoard";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { Milestone } from "../types";

export const Preview: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isHideInfo, setIsHideInfo] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>();

  const {
    shortDescData,
    milestones,
    teamAndLinkData,
    actions: { goNextStep },
  } = useMakeRequestState();

  const selectMilestone = (milestone: Milestone) => {
    setSelectedMilestone(
      milestone.id === selectedMilestone?.id ? undefined : milestone,
    );
  };

  return (
    <View>
      <FlexRow>
        <View style={{ flex: 1 }}>
          {!isHideInfo && (
            <>
              <FlexRow
                style={{
                  marginTop: layout.spacing_x4,
                  justifyContent: "space-between",
                }}
                breakpoint={550}
              >
                {/* Left block ======================================================= */}
                <View style={{ flex: 1 }}>
                  <FlexRow breakpoint={800}>
                    {/* Image */}
                    <RoundedGradientImage size="L" square sourceURI="" />

                    {/* Name and Description */}
                    <View
                      style={{ marginHorizontal: layout.spacing_x2, flex: 1 }}
                    >
                      <BrandText
                        style={[
                          fontSemibold20,
                          { marginTop: layout.spacing_x2 },
                        ]}
                      >
                        {shortDescData?.name}
                      </BrandText>

                      <BrandText
                        style={[
                          fontSemibold13,
                          {
                            color: neutralA3,
                            marginTop: layout.spacing_x2,
                          },
                        ]}
                      >
                        {shortDescData?.desc}
                      </BrandText>

                      <SpacerColumn size={2} />

                      <TertiaryBox
                        style={{
                          backgroundColor: neutral22,
                          borderWidth: 0,
                          padding: layout.spacing_x1_5,
                          width: 280,
                        }}
                      >
                        <FlexRow
                          style={{ justifyContent: "center", width: "100%" }}
                        >
                          <SVG source={gnoSVG} width={18} height={18} />
                          <BrandText
                            style={[
                              fontSemibold13,
                              { marginLeft: layout.spacing_x1_5 },
                            ]}
                          >
                            @{shortDescData?.paymentAddr}
                          </BrandText>
                        </FlexRow>
                      </TertiaryBox>
                    </View>
                  </FlexRow>

                  <SpacerColumn size={2} />

                  <FlexRow>
                    <Tag text="Open" color="#C8FFAE" bgColor="#C8FFAE1A" />

                    <SpacerRow size={2} />

                    {shortDescData?.tags.split(",").map((tag) => {
                      return (
                        <Tag
                          text={tag}
                          color={neutral77}
                          borderColor={neutral33}
                          bgColor={neutral00}
                          containerStyle={{ marginRight: layout.spacing_x2 }}
                        />
                      );
                    })}
                  </FlexRow>
                </View>

                {/* Right block ======================================================= */}
                <View style={{ marginTop: layout.spacing_x2 }}>
                  <TertiaryBox
                    style={{
                      backgroundColor: neutral22,
                      borderWidth: 0,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      width: 224,
                    }}
                  >
                    <FlexRow
                      style={{ justifyContent: "center", width: "100%" }}
                    >
                      <BrandText style={[fontSemibold20, { color: neutral77 }]}>
                        Grant:
                      </BrandText>
                      <SpacerRow size={1} />
                      <BrandText
                        style={[fontSemibold20, { color: primaryColor }]}
                      >
                        ${shortDescData?.budget}
                      </BrandText>
                    </FlexRow>
                  </TertiaryBox>

                  <SpacerColumn size={2} />

                  <View style={{ backgroundColor: neutral22 }}>
                    <Link to={teamAndLinkData?.websiteLink}>
                      <SocialButton
                        text="Share URL"
                        iconSvg={shareSVG}
                        iconColor={secondaryColor}
                        textColor={neutralA3}
                      />
                    </Link>

                    <SpacerRow size={1} />

                    <Link to={teamAndLinkData?.discordLink}>
                      <SocialButton
                        text="Discord URL"
                        iconSvg={discordSVG}
                        textColor={neutralA3}
                      />
                    </Link>

                    <SpacerRow size={1} />

                    <Link to={teamAndLinkData?.websiteLink}>
                      <SocialButton
                        text="Website URL"
                        iconSvg={websiteSVG}
                        textColor={neutralA3}
                      />
                    </Link>

                    <SpacerRow size={1} />

                    <Link to={teamAndLinkData?.githubLink}>
                      <SocialButton
                        text="Github URL"
                        iconSvg={githubSVG}
                        textColor={neutralA3}
                      />
                    </Link>

                    <SpacerRow size={1} />

                    <Link to={teamAndLinkData?.discordLink}>
                      <SocialButton
                        text="Twitter URL"
                        iconSvg={twitterSVG}
                        textColor={neutralA3}
                      />
                    </Link>
                  </View>
                </View>
              </FlexRow>
              <SpacerColumn size={2} />
            </>
          )}

          {/* Milestones block ======================================================= */}
          <View
            style={{
              // NOTE: trick to get will width background on responsible/large ScreenContainer
              marginHorizontal: -140,
              paddingHorizontal: 140,
              backgroundColor: neutral17,
              paddingVertical: layout.spacing_x3,
            }}
          >
            <FlexRow>
              <BrandText
                onPress={() => setIsHideInfo(!isHideInfo)}
                style={fontSemibold20}
              >
                All Milestones:
              </BrandText>
              <SpacerRow size={1} />
              <BrandText
                style={[fontSemibold20, { color: neutral77, flexGrow: 1 }]}
              >
                {milestones.length}
              </BrandText>

              <SearchBarInput
                placeholder="Type to search..."
                text={searchText}
                onChangeText={setSearchText}
                inputStyle={{ backgroundColor: neutral00 }}
                noBrokenCorners
              />
            </FlexRow>

            <Separator
              color={neutral33}
              style={{
                marginBottom: layout.spacing_x2,
                marginTop: layout.spacing_x3,
              }}
            />

            <MilestoneBoard selectMilestone={selectMilestone} />
          </View>
        </View>

        {/* Detail view ======================================================= */}
        {selectedMilestone != null && (
          <View
            style={{
              width: 300,
              alignSelf: "flex-start",
              borderLeftWidth: 1,
              borderLeftColor: neutral33,
              backgroundColor: neutral00,
              height: "100%",
              marginLeft: layout.spacing_x2,
              marginRight: -layout.spacing_x3 * 2,
              paddingHorizontal: layout.spacing_x2,
              paddingVertical: layout.spacing_x4,
            }}
          >
            <BrandText style={fontSemibold20}>
              {selectedMilestone.name}
            </BrandText>

            <SpacerColumn size={3} />

            <FlexRow style={{ justifyContent: "space-between" }}>
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                Status
              </BrandText>

              <Tag
                bgColor="#2F4469"
                color="#ffffff"
                text={capitalize(selectedMilestone.statusId)}
              />
            </FlexRow>

            <SpacerColumn size={2} />

            <FlexRow style={{ justifyContent: "space-between" }}>
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                Priority
              </BrandText>

              <Tag
                bgColor="#673932"
                color="#ffffff"
                text={capitalize(selectedMilestone.priority)}
              />
            </FlexRow>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <BrandText style={fontSemibold14}>Description</BrandText>

            <SpacerColumn size={2} />

            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {selectedMilestone.desc}
            </BrandText>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <Link to={selectedMilestone.githubLink}>
              <TertiaryBox
                style={{
                  backgroundColor: neutral22,
                  padding: layout.spacing_x1_5,
                  flexDirection: "row",
                }}
              >
                <SVG source={githubSVG} width={24} height={24} />

                <BrandText
                  style={[
                    fontSemibold13,
                    { flexGrow: 1, marginLeft: layout.spacing_x0_5 },
                  ]}
                >
                  Github milestone link
                </BrandText>

                <SVG source={chevronRightSVG} width={24} height={24} />
              </TertiaryBox>
            </Link>
          </View>
        )}
      </FlexRow>
      <MakeRequestFooter disableNext={false} onSubmit={goNextStep} />
    </View>
  );
};
