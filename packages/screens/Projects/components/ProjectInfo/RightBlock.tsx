import { Link } from "@react-navigation/native";
import moment from "moment/moment";
import React from "react";
import { View } from "react-native";

import discordSVG from "@/assets/icons/discord.svg";
import githubSVG from "@/assets/icons/github.svg";
import shareSVG from "@/assets/icons/share.svg";
import twitterSVG from "@/assets/icons/twitter.svg";
import websiteSVG from "@/assets/icons/website.svg";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { SocialButton } from "@/components/buttons/SocialButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { Project } from "@/screens/Projects/types";
import { prettyPrice } from "@/utils/coins";
import {
  neutral22,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  yellowDefault,
} from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";

type RightBlockProps = {
  project: Project;
};

export const RightBlock: React.FC<RightBlockProps> = ({ project }) => {
  const isFunded = project.funded;
  const networkId = useSelectedNetworkId();
  const shortDescData = project.metadata.shortDescData;
  const teamAndLinkData = project.metadata.teamAndLinkData;

  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  return (
    <View>
      <TertiaryBox
        style={{
          backgroundColor: neutral22,
          borderWidth: 0,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <FlexRow style={{ justifyContent: "center", width: "100%" }}>
          <BrandText
            style={[
              fontSemibold20,
              { color: isFunded ? yellowDefault : neutral77 },
            ]}
          >
            {isFunded ? "Deposited:" : "Budget:"}
          </BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold20, { color: primaryColor }]}>
            {prettyPrice(
              networkId,
              shortDescData?.budget.toString(),
              pmFeature?.paymentsDenom,
            )}
          </BrandText>
        </FlexRow>
      </TertiaryBox>

      <SpacerColumn size={2} />

      <TertiaryBox
        style={{
          backgroundColor: neutral22,
          borderWidth: 0,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <FlexRow style={{ justifyContent: "center", width: "100%" }}>
          <BrandText style={[fontSemibold20, { color: neutral77 }]}>
            Expire At:
          </BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold20, { color: primaryColor }]}>
            {moment(shortDescData.duration * 1000 + Date.now()).format("L")}
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

      <SpacerColumn size={2} />
    </View>
  );
};
