import { Link } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

import { Tag } from "./Milestone";
import discordSVG from "../../../../assets/icons/discord.svg";
import githubSVG from "../../../../assets/icons/github.svg";
import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutralA3,
  neutral22,
  neutral77,
  neutral33,
  neutral00,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ShortDescData, TeamAndLinkData } from "../types";

export const ProjectInfo: React.FC<{
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
}> = ({ shortDescData, teamAndLinkData }) => {
  return (
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
            <RoundedGradientImage
              size="L"
              square
              sourceURI={
                shortDescData.coverImg || shortDescData._coverImgFile?.url
              }
            />

            {/* Name and Description */}
            <View style={{ marginHorizontal: layout.spacing_x2, flex: 1 }}>
              <BrandText
                style={[fontSemibold20, { marginTop: layout.spacing_x2 }]}
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
                <FlexRow style={{ justifyContent: "center", width: "100%" }}>
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

            {shortDescData?.tags.split(",").map((tag, idx) => {
              return (
                <Tag
                  key={idx}
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
            <FlexRow style={{ justifyContent: "center", width: "100%" }}>
              <BrandText style={[fontSemibold20, { color: neutral77 }]}>
                Grant:
              </BrandText>
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold20, { color: primaryColor }]}>
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
  );
};
