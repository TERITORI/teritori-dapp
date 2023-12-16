import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Tag } from "./Milestone";
import discordSVG from "../../../../assets/icons/discord.svg";
import githubSVG from "../../../../assets/icons/github.svg";
import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { Link } from "../../../components/Link";
import { SVG } from "../../../components/SVG";
import { BoxStyle } from "../../../components/boxes/Box";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SimpleButton } from "../../../components/buttons/SimpleButton";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { Separator } from "../../../components/separators/Separator";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral17,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Project } from "../types";

export const GrantBox: React.FC<{
  onPress?: () => void;
  containerStyle?: BoxStyle;
  project: Project;
}> = ({ containerStyle, onPress, project }) => {
  if (!project) {
    return null;
  }

  return (
    <TertiaryBox style={[containerStyle, { width: 400 }]}>
      {/* Body ============================================================== */}
      <View style={{ margin: layout.spacing_x2 }}>
        <FlexRow>
          <TouchableOpacity onPress={onPress}>
            <RoundedGradientImage size="S" square sourceURI="" />
          </TouchableOpacity>

          <View style={{ marginLeft: layout.spacing_x2 }}>
            <TouchableOpacity onPress={onPress}>
              <BrandText style={fontSemibold20}>
                {project.metadata.shortDescData.name}
              </BrandText>
            </TouchableOpacity>
            <FlexRow style={{ marginTop: layout.spacing_x0_75 }}>
              {project.metadata.shortDescData.tags.split(",").map((tag) => (
                <Tag
                  text={tag}
                  containerStyle={{ marginRight: layout.spacing_x1 }}
                />
              ))}
            </FlexRow>
          </View>
        </FlexRow>

        <BrandText
          style={[
            fontSemibold13,
            { color: neutral77, marginTop: layout.spacing_x2 },
          ]}
        >
          {project.metadata.shortDescData.desc}
        </BrandText>
      </View>

      {/* Footer ============================================================== */}
      <View
        style={{
          width: "100%",
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
        }}
      >
        <FlexRow style={{ justifyContent: "space-between" }}>
          <SVG source={gnoSVG} width={24} height={24} color="red" />

          <BrandText
            style={[
              fontSemibold13,
              { flexGrow: 1, marginLeft: layout.spacing_x2 },
            ]}
          >
            @{project.metadata.shortDescData.paymentAddr}
          </BrandText>

          <FlexRow style={{ width: "auto" }}>
            <BrandText style={[fontSemibold13, { color: neutral77 }]}>
              Grant:
            </BrandText>
            <BrandText style={fontSemibold13}>
              ${project.metadata.shortDescData.budget}
            </BrandText>
          </FlexRow>
        </FlexRow>

        <Separator style={{ marginVertical: layout.spacing_x2 }} />

        <FlexRow>
          <FlexRow style={{ flexGrow: 1, width: "auto" }}>
            <SocialButton
              text=""
              iconSvg={shareSVG}
              iconColor={secondaryColor}
            />

            <SpacerRow size={1} />

            <Link to={project.metadata.teamAndLinkData.discordLink}>
              <SocialButton text="" iconSvg={discordSVG} />
            </Link>

            <SpacerRow size={1} />

            <Link to={project.metadata.teamAndLinkData.websiteLink}>
              <SocialButton text="" iconSvg={websiteSVG} />
            </Link>

            <SpacerRow size={1} />

            <Link to={project.metadata.teamAndLinkData.githubLink}>
              <SocialButton text="" iconSvg={githubSVG} />
            </Link>

            <SpacerRow size={1} />

            <Link to={project.metadata.teamAndLinkData.twitterProfile}>
              <SocialButton text="" iconSvg={twitterSVG} />
            </Link>
          </FlexRow>

          <SimpleButton
            text={project.status}
            size="SM"
            bgColor="#C8FFAE1A"
            color="#C8FFAE"
            style={{ borderWidth: 0 }}
          />
        </FlexRow>
      </View>
    </TertiaryBox>
  );
};
