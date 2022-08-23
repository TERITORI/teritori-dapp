import React from "react";
import { Image, View } from "react-native";

import Guardian1PNG from "../../../assets/default-images/guardian_1.png";
import DiscordSVG from "../../../assets/icons/discord.svg";
import TwitterSVG from "../../../assets/icons/twitter.svg";
import WebsiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import { SocialNetworks } from "../../components/Footer";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SocialButton } from "../../components/buttons/SocialButton";
import { AttributesCard } from "../../components/cards/AttributesCard";
import { ProgressionCard } from "../../components/cards/ProgressionCard";
import { SecondaryCard } from "../../components/cards/SecondaryCard";
import { BackTo } from "../../components/navigation/BackTo";
import {
  neutral33,
  neutral77,
  primaryColor,
  yellowDefault,
} from "../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../utils/style/fonts";

//TODO: Dynamic data (Collection id is in route.params.id)

// export const MintCollectionScreen: React.FC<{
//   route: RouteProp<RootStackParamList, "NSBConsultName">;
// }> = ({ route }) => {
export const MintCollectionScreen: React.FC = () => {
  return (
    <ScreenContainer
      footerChildren={<SocialNetworks />}
      headerChildren={<BackTo label="Guardians Collection" />}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 72,
          minHeight: 702,
          maxHeight: 702,
        }}
      >
        {/* ===== Left container */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            marginRight: 24,
            width: "100%",
            maxWidth: 534,
            minWidth: 534,
          }}
        >
          <TertiaryBadge label="GENESIS LAUNCH" style={{ marginBottom: 24 }} />

          <BrandText style={{ marginBottom: 12 }}>
            Genesis Guardians of Teritori
          </BrandText>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <AttributesCard
              label="Supply"
              value="5000"
              style={{ marginRight: 12 }}
            />
            <AttributesCard
              label="Price"
              value="5 SOL"
              style={{ marginRight: 12 }}
            />
            <AttributesCard label="Limit Buy" value="5 by address" />
          </View>

          <BrandText style={[fontSemibold14, { marginBottom: 24 }]}>
            {"For decades, the destruction of ecosystems and social relations has turned people into soulless robots. " +
              "At the same time, inequality explodes every year and misery becomes the norm for the silent majority.\n\n" +
              "A minority of powerful & wealthy leaders, called the “The Legion'', have set up a technological & political" +
              "system allowing them to continue to develop their wealth and safety.\n" +
              "Of course this system only serves the happy few elite members of the society while the majority survives in" +
              "an increasingly uncertain world.\n\n" +
              "Small groups start to gather in the shadows to take action.\n" +
              "They go by the name of “Guardians” and believe that everyone should be able to live autonomously without the" +
              "need to rely on “The Legion”. Their solution for a better world is to offer a decentralized ecosystem open" +
              "to anyone, rich or poor."}
          </BrandText>

          <ProgressionCard
            label="Tokens Minted"
            valueCurrent={1343}
            valueMax={1999}
            style={{ marginBottom: 32 }}
          />

          <PrimaryButton
            text="Mint now"
            style={{ marginBottom: 24 }}
            width={160}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <SocialButton
              text="Discord"
              iconSvg={
                <>
                  <DiscordSVG />
                </>
              }
              style={{ marginRight: 12 }}
            />
            <SocialButton
              text="Website"
              iconSvg={
                <>
                  <WebsiteSVG />
                </>
              }
              style={{ marginRight: 12 }}
            />
            <SocialButton
              text="Twitter"
              iconSvg={
                <>
                  <TwitterSVG />
                </>
              }
            />
          </View>
        </View>

        {/* ===== Right container */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "100%",
            maxWidth: 534,
            minWidth: 534,
            minHeight: 806,
            maxHeight: 806,
          }}
        >
          <SecondaryCard
            paddingVertical={0}
            paddingHorizontal={0}
            width={534}
            height={534}
            style={{ marginBottom: 40 }}
          >
            {/*SecondaryCard has borders width 1px, so we must remove 2px to height and width from this Image to correctly size it*/}
            <Image
              source={Guardian1PNG}
              style={{ width: 532, height: 532, borderRadius: 8 }}
            />
          </SecondaryCard>

          <BrandText style={[fontSemibold20, { marginBottom: 24 }]}>
            Activity
          </BrandText>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TertiaryBadge label="Presale" />
            {/*TODO: Gradient text yellow*/}
            <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
              ENDED
            </BrandText>
          </View>

          <View
            style={{
              borderBottomColor: neutral33,
              borderBottomWidth: 1,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
              >
                Whitelist
              </BrandText>
              <BrandText style={fontSemibold16}>953</BrandText>

              <View
                style={{
                  borderRadius: 999,
                  width: 2,
                  height: 2,
                  marginHorizontal: 12,
                  backgroundColor: neutral77,
                }}
              />

              <BrandText
                style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
              >
                Max
              </BrandText>
              <BrandText style={fontSemibold16}>1</BrandText>
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginLeft: 5 }]}
              >
                Token
              </BrandText>

              <View
                style={{
                  borderRadius: 999,
                  width: 2,
                  height: 2,
                  marginHorizontal: 12,
                  backgroundColor: neutral77,
                }}
              />

              <BrandText style={fontSemibold16}>1.8</BrandText>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TertiaryBadge label="Public Mint" />
            {/*TODO: Gradient text blue*/}
            <BrandText style={[fontSemibold16, { color: primaryColor }]}>
              IN PROGRESS
            </BrandText>
          </View>

          <View style={{ borderBottomColor: neutral33, borderBottomWidth: 1 }}>
            <BrandText style={[fontSemibold16, { marginVertical: 16 }]}>
              1.8
            </BrandText>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
