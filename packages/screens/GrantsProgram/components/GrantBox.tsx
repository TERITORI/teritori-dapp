import React from "react";
import { View, ViewStyle } from "react-native";

import discordSVG from "../../../../assets/icons/discord.svg";
import githubSVG from "../../../../assets/icons/github.svg";
import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import twitterSVG from "../../../../assets/icons/twitter.svg";
import websiteSVG from "../../../../assets/icons/website.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SimpleButton } from "../../../components/buttons/SimpleButton";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral17,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const GrantBox: React.FC<{
  containerStyle?: ViewStyle;
}> = ({ containerStyle }) => {
  return (
    <TertiaryBox width={400} noBrokenCorners style={containerStyle}>
      {/* Body ============================================================== */}
      <View style={{ margin: layout.padding_x2 }}>
        <FlexRow>
          <RoundedGradientImage size="S" square sourceURI="" />

          <View style={{ marginLeft: layout.padding_x2 }}>
            <BrandText style={fontSemibold20}>
              Create a web Game using Gnolang
            </BrandText>
          </View>
        </FlexRow>

        <BrandText
          style={[
            fontSemibold13,
            { color: neutral77, marginTop: layout.padding_x2 },
          ]}
        >
          Build a simple but creative browser based game using Gnolang,
          interacting with various custom realms, and providing a great user
          experience. Free your creativity!
        </BrandText>
      </View>

      {/* Footer ============================================================== */}
      <View
        style={{
          width: "100%",
          backgroundColor: neutral17,
          padding: layout.padding_x2,
        }}
      >
        <FlexRow style={{ justifyContent: "space-between" }}>
          <SVG source={gnoSVG} width={24} height={24} color="red" />

          <BrandText
            style={[
              fontSemibold13,
              { flexGrow: 1, marginLeft: layout.padding_x2 },
            ]}
          >
            @Community-Grants-DAO.gno
          </BrandText>

          <FlexRow style={{ width: "auto" }}>
            <BrandText style={[fontSemibold13, { color: neutral77 }]}>
              Grant:
            </BrandText>
            <BrandText style={fontSemibold13}> $50K</BrandText>
          </FlexRow>
        </FlexRow>

        <Separator style={{ marginVertical: layout.padding_x2 }} />

        <FlexRow>
          <FlexRow style={{ flexGrow: 1, width: "auto" }}>
            <SocialButton
              text=""
              iconSvg={shareSVG}
              iconColor={secondaryColor}
            />
            <SpacerRow size={1} />
            <SocialButton text="" iconSvg={discordSVG} />
            <SpacerRow size={1} />
            <SocialButton text="" iconSvg={websiteSVG} />
            <SpacerRow size={1} />
            <SocialButton text="" iconSvg={githubSVG} />
            <SpacerRow size={1} />
            <SocialButton text="" iconSvg={twitterSVG} />
          </FlexRow>

          <SimpleButton
            text="Open"
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
