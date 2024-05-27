import { Link } from "@react-navigation/native";
import moment from "moment/moment";
import React from "react";
import { View } from "react-native";

import copySVG from "@/assets/icons/copy.svg";
import discordSVG from "@/assets/icons/discord.svg";
import githubSVG from "@/assets/icons/github.svg";
import twitterSVG from "@/assets/icons/twitter.svg";
import websiteSVG from "@/assets/icons/website.svg";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { IconWithTextButton } from "@/components/buttons/SocialButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import Clipboard from "@/modules/Clipboard";
import { Project } from "@/screens/Projects/types";
import { prettyPrice } from "@/utils/coins";
import { joinElements } from "@/utils/react";
import {
  neutral22,
  neutral77,
  neutralA3,
  primaryColor,
  yellowDefault,
} from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { normalizeTwitterId } from "@/utils/twitter";

type RightBlockProps = {
  project: Project;
  networkId: string;
};

export const RightBlock: React.FC<RightBlockProps> = ({
  networkId,
  project,
}) => {
  const { setToast } = useFeedbacks();

  const isFunded = project.funded;
  const teamAndLinkData = project.metadata?.teamAndLinkData;

  const actions = [
    <IconWithTextButton
      text="Permanent link"
      iconSvg={copySVG}
      textColor={neutralA3}
      onPress={async () => {
        await Clipboard.setStringAsync(window.location.href);
        setToast({
          title: "Copied permanent link",
          message: "",
          type: "success",
          mode: "normal",
        });
      }}
    />,
  ];

  if (teamAndLinkData?.websiteLink) {
    actions.push(
      <Link to={teamAndLinkData?.websiteLink}>
        <IconWithTextButton
          text="Website URL"
          iconSvg={websiteSVG}
          textColor={neutralA3}
        />
      </Link>,
    );
  }

  if (teamAndLinkData?.discordLink) {
    actions.push(
      <Link to={teamAndLinkData?.discordLink}>
        <IconWithTextButton
          text="Discord URL"
          iconSvg={discordSVG}
          textColor={neutralA3}
        />
      </Link>,
    );
  }

  if (teamAndLinkData?.githubLink) {
    actions.push(
      <Link to={teamAndLinkData?.githubLink}>
        <IconWithTextButton
          text="Github URL"
          iconSvg={githubSVG}
          textColor={neutralA3}
        />
      </Link>,
    );
  }

  if (teamAndLinkData?.twitterProfile) {
    actions.push(
      <Link to={normalizeTwitterId(teamAndLinkData?.twitterProfile)}>
        <IconWithTextButton
          text="Twitter URL"
          iconSvg={twitterSVG}
          textColor={neutralA3}
        />
      </Link>,
    );
  }

  return (
    <View>
      <TertiaryBox
        style={{
          backgroundColor: neutral22,
          borderWidth: 0,
          padding: layout.spacing_x1_5,
        }}
      >
        <FlexRow style={{ justifyContent: "space-between", width: "100%" }}>
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
            {prettyPrice(networkId, project.budget, project.paymentDenom)}
          </BrandText>
        </FlexRow>
      </TertiaryBox>

      <SpacerColumn size={2} />

      <TertiaryBox
        style={{
          backgroundColor: neutral22,
          borderWidth: 0,
          padding: layout.spacing_x1_5,
        }}
      >
        <FlexRow style={{ justifyContent: "space-between", width: "100%" }}>
          <BrandText style={[fontSemibold20, { color: neutral77 }]}>
            Expires on:
          </BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold20, { color: primaryColor }]}>
            {/* FIXME */}
            {moment(/*project.duration ||*/ 0 * 1000 + Date.now()).format(
              "L",
            )}{" "}
          </BrandText>
        </FlexRow>
      </TertiaryBox>

      <SpacerColumn size={2} />

      <TertiaryBox
        style={{
          backgroundColor: neutral22,
          borderWidth: 0,
          padding: layout.spacing_x1_5,
        }}
      >
        {joinElements(actions, <SpacerColumn size={1.5} />)}
      </TertiaryBox>
    </View>
  );
};
