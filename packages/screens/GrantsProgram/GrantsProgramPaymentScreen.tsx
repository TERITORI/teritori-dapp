import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { Tag } from "./components/Milestone";
import { useProject } from "./hooks/useProjects";
import discordSVG from "../../../assets/icons/discord.svg";
import githubSVG from "../../../assets/icons/github.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SocialButton } from "../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { ScreenFC } from "../../utils/navigation";
import {
  neutral17,
  neutral77,
  neutralA3,
  neutralFF,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const CustomSocialButton: React.FC<{
  text: string;
  iconSvg: React.FC<SvgProps>;
}> = ({ text, iconSvg }) => {
  return (
    <SocialButton
      text={text}
      iconSvg={iconSvg}
      textColor={neutralA3}
      style={{ width: "100%" }}
      bgColor={neutral17}
    />
  );
};

export const GrantsProgramPaymentScreen: ScreenFC<
  "GrantsProgramPayment"
> = () => {
  const networkId = useSelectedNetworkId();
  const projectId = "0";
  const { data: project } = useProject(networkId, projectId);

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow style={{ marginTop: layout.spacing_x4 }}>
        <RoundedGradientImage
          size="S"
          square
          sourceURI={project?.metadata.shortDescData.coverImg}
        />
        <SpacerRow size={2} />
        <BrandText style={fontSemibold28}>
          {project?.metadata.shortDescData.name}
        </BrandText>
      </FlexRow>

      <Separator style={{ marginVertical: layout.spacing_x2 }} />

      <FlexRow style={{ alignItems: "flex-start" }}>
        {/* Left Col ==========================================================*/}
        <View style={{ flex: 1 }}>
          <TertiaryBox
            style={{
              backgroundColor: neutral17,
              borderWidth: 0,
              padding: layout.spacing_x2,
            }}
          >
            <BrandText
              style={[
                fontSemibold14,
                { color: neutralFF, alignSelf: "flex-start" },
              ]}
            >
              Description
            </BrandText>

            <SpacerColumn size={2} />

            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {project?.metadata.shortDescData.desc}
            </BrandText>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <TertiaryBox
            style={{
              backgroundColor: neutral17,
              padding: layout.spacing_x2,
              borderWidth: 0,
            }}
          >
            <FlexRow>
              <BrandText style={[fontSemibold14, { color: neutralFF }]}>
                Tags:
              </BrandText>

              {project?.metadata.shortDescData.tags.split(",").map((tag) => {
                return (
                  <Tag
                    text={tag}
                    containerStyle={{ marginLeft: layout.spacing_x1_5 }}
                  />
                );
              })}

              <View style={{ flexGrow: 1, alignItems: "flex-end" }}>
                <Tag text="23.06.2023" />
              </View>
            </FlexRow>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <TertiaryBox
            style={{
              backgroundColor: neutral17,
              padding: layout.spacing_x2,
              borderWidth: 0,
            }}
          >
            <BrandText
              style={[
                fontSemibold14,
                { color: neutralFF, alignSelf: "flex-start" },
              ]}
            >
              Report input:
            </BrandText>

            <SpacerColumn size={2} />

            <TextInputCustom
              label=""
              name="name"
              placeholder="Enter details here..."
              hideLabel
              multiline
              noBrokenCorners
              containerStyle={{ width: "100%" }}
              textInputStyle={{ height: 80 }}
            />
          </TertiaryBox>
        </View>

        <SpacerRow size={2} />

        {/* Right Col =========================================================*/}
        <View style={{ maxWidth: 264 }}>
          <TertiaryBox
            style={{
              padding: layout.spacing_x2,
              backgroundColor: neutral17,
              borderWidth: 0,
            }}
          >
            <FlexRow style={{ justifyContent: "space-between", width: "100%" }}>
              <BrandText style={fontSemibold20}>Grant</BrandText>
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold20, { color: primaryColor }]}>
                $50K
              </BrandText>
            </FlexRow>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <FlexRow style={{ justifyContent: "space-between", width: "100%" }}>
              <BrandText style={fontSemibold14}>Status</BrandText>

              <Tag text="Open" color="#C8FFAE" bgColor="#C8FFAE1A" />
            </FlexRow>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <View style={{ justifyContent: "flex-start", width: "100%" }}>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Created by:
              </BrandText>

              <BrandText style={fontSemibold14}>
                @0x17dfsdvgsd98fsbsd9b8sd
              </BrandText>
            </View>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <TertiaryBox
            style={{
              padding: layout.spacing_x2,
              backgroundColor: neutral17,
              borderWidth: 0,
            }}
          >
            <CustomSocialButton text="Discord URL" iconSvg={discordSVG} />
            <SpacerRow size={1} />
            <CustomSocialButton text="Website URL" iconSvg={websiteSVG} />
            <SpacerRow size={1} />
            <CustomSocialButton text="Github URL" iconSvg={githubSVG} />
            <SpacerRow size={1} />
            <CustomSocialButton text="Twitter URL" iconSvg={twitterSVG} />
          </TertiaryBox>

          <SpacerColumn size={2} />

          <PrimaryButton fullWidth text="Proceed to Payment Proposal" />
        </View>
      </FlexRow>
    </ScreenContainer>
  );
};
