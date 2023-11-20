import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { Tag } from "./Tag";
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

export const GrantBox: React.FC<{
  onPress?: () => void;
  containerStyle?: ViewStyle;
}> = ({ containerStyle, onPress }) => {
  return (
    <TertiaryBox width={400} noBrokenCorners style={containerStyle}>
      {/* Body ============================================================== */}
      <View style={{ margin: layout.spacing_x2 }}>
        <FlexRow>
          <TouchableOpacity onPress={onPress}>
            <RoundedGradientImage size="S" square sourceURI="" />
          </TouchableOpacity>

          <View style={{ marginLeft: layout.spacing_x2 }}>
            <TouchableOpacity onPress={onPress}>
              <BrandText style={fontSemibold20}>
                Create a web Game using Gnolang
              </BrandText>
            </TouchableOpacity>
            <FlexRow style={{ marginTop: layout.spacing_x0_75 }}>
              <Tag
                text="2005.12.4"
                containerStyle={{ marginRight: layout.spacing_x1 }}
              />
              <Tag
                text="dapp"
                containerStyle={{ marginRight: layout.spacing_x1 }}
              />
              <Tag
                text="Structure"
                containerStyle={{ marginRight: layout.spacing_x1 }}
              />
            </FlexRow>
          </View>
        </FlexRow>

        <BrandText
          style={[
            fontSemibold13,
            { color: neutral77, marginTop: layout.spacing_x2 },
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
            @Community-Grants-DAO.gno
          </BrandText>

          <FlexRow style={{ width: "auto" }}>
            <BrandText style={[fontSemibold13, { color: neutral77 }]}>
              Grant:
            </BrandText>
            <BrandText style={fontSemibold13}> $50K</BrandText>
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
