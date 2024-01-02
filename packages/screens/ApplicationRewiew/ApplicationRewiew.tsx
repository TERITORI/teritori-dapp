import React from "react";
import {
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

import guardianPng from "../../../assets/default-images/guardian_profile.png";
import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { Box } from "../../components/boxes/Box";
import { useAppNavigation } from "../../utils/navigation";
import {
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
  primaryTextColor,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const dummyData = [
  { title: "Supply", value: "5000" },
  { title: "Price", value: "5 SOL" },
  { title: "Limit Buy", value: "5 by address" },
];

const applicationSocialData = [
  { icon: discordSVG, name: "Discord" },
  { icon: websiteSVG, name: "Website" },
  { icon: twitterSVG, name: "Twitter" },
];
const LG_BREAKPOINT = 1250;
const MD_BREAKPOINT = 800;

export const ApplicationRewiewScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Launchpad Applications</BrandText>
      }
      responsive
      onBackPress={() => navigation.goBack()}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: width >= LG_BREAKPOINT ? "row" : "column-reverse",
            alignItems: width >= LG_BREAKPOINT ? "flex-start" : "center",
            justifyContent: "center",
            marginTop: 72,
            paddingBottom: 40,
          }}
        >
          {/* ===== Left container */}
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{ alignSelf: "flex-start" }}>
              <TertiaryBadge size="SM" label="PENDING REVIEW" />
            </View>
            <BrandText style={[fontSemibold28, { marginTop: 24 }]}>
              Yellow Block Generation
            </BrandText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 10,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {dummyData?.map((item, index) => (
                <ApplicationCard rowData={item} key={index} />
              ))}
            </View>
            <View style={{ marginTop: 24 }}>
              <BrandText style={fontSemibold14}>
                For decades, the destruction of ecosystems and social relations
                has turned people into soulless robots. At the same time,
                inequality explodes every year and misery becomes the norm for
                the silent majority.
              </BrandText>
              <BrandText style={[fontSemibold14, { marginTop: 15 }]}>
                A minority of powerful & wealthy leaders, called the “The
                Legion'', have set up a technological & political system
                allowing them to continue to develop their wealth and safety.
              </BrandText>
              <BrandText style={fontSemibold14}>
                Of course this system only serves the happy few elite members of
                the society while the majority survives in an increasingly
                uncertain world.
              </BrandText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 24,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {applicationSocialData?.map((item, index) => (
                <ApplicationSocialCard socialData={item} key={index} />
              ))}
            </View>
            <TouchableOpacity>
              <Box
                notched
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  backgroundColor: primaryColor,
                  marginTop: 32,
                  width: 146,
                }}
              >
                <BrandText
                  style={[fontSemibold14, { color: primaryTextColor }]}
                >
                  Approve
                </BrandText>
              </Box>
            </TouchableOpacity>
          </View>
          {/* ===== Right container */}
          <View
            style={{
              flex: 1,
            }}
          >
            <Image
              style={{
                width: 450,
                height: 450,
              }}
              source={guardianPng}
            />
          </View>
        </View>
        <View>
          <CreatorInformation />
          <ProjectInformation />
          <TeamInformation />
          <InvestmentInformation />
        </View>
      </View>
    </ScreenContainer>
  );
};

const ApplicationCard: React.FC<{ rowData: any }> = ({ rowData }) => {
  return (
    <Box
      notched
      style={{
        borderRadius: 6,
        borderWidth: 1,
        borderColor: neutral33,
        padding: 12,
        width: 132,
      }}
    >
      <BrandText style={[fontSemibold12, { color: neutral77 }]}>
        {rowData?.title}
      </BrandText>
      <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
        {rowData?.value}
      </BrandText>
    </Box>
  );
};

const ApplicationSocialCard: React.FC<{ socialData: any }> = ({
  socialData,
}) => {
  return (
    <Box
      notched
      style={{
        borderRadius: 6,
        padding: 6,
        backgroundColor: neutral22,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box
        notched
        style={{
          borderRadius: 6,
          backgroundColor: neutral33,
          padding: 8,
        }}
      >
        <SVG width={22} height={22} source={socialData?.icon} color="white" />
      </Box>
      <BrandText style={[fontSemibold14, { marginStart: 8, marginEnd: 16 }]}>
        {socialData?.name}
      </BrandText>
    </Box>
  );
};

const CreatorInformation: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        borderTopColor: neutral33,
        borderTopWidth: 1,
        paddingTop: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Creator information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Creator Name
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            @nickname
          </BrandText>
        </Box>
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Creator Name
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            @nickname
          </BrandText>
        </Box>
        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <Box
            notched
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Twitter Follower Range
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              5000
            </BrandText>
          </Box>
          <Box
            notched
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Twitter Follower Count
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              5000
            </BrandText>
          </Box>
        </View>
      </View>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 12,
          gap: 12,
        }}
      >
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Main Contact Discord
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            @nickname
          </BrandText>
        </Box>
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Discord URL
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            https://discord.com/link
          </BrandText>
        </Box>
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Main Contact Email
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            hello@email.com
          </BrandText>
        </Box>
      </View>
    </View>
  );
};

const ProjectInformation: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingTop: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Project information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Creator Name
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion''.
          </BrandText>
        </Box>
        <LinkCard
          title="Other Links"
          linksData={[
            { title: "Instagram", link: "https://instagram.com/loremipsum" },
            { title: "Telegram", link: "@nickname" },
            { title: "Signal", link: "@nickname" },
          ]}
        />
        <View style={{ flex: 1, gap: 12 }}>
          <Box
            notched
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Previous Apply
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              Apply Name
            </BrandText>
          </Box>
          <Box
            notched
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 6,
              padding: 12,
              flex: 1,
            }}
          >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              Project Type
            </BrandText>
            <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
              Type
            </BrandText>
          </Box>
        </View>
      </View>
    </View>
  );
};

const TeamInformation: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingTop: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Team information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          gap: 12,
        }}
      >
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
            height: "100%",
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Team Description
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion'', have set up a technological & political system allowing
            them to continue to develop their wealth and safety.
          </BrandText>
        </Box>
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
            height: "100%",
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Partners Description
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion'', have set up a technological & political system allowing
            them to continue to develop their wealth and safety.
          </BrandText>
        </Box>
        <LinkCard
          title="Other Links"
          linksData={[
            { title: "Instagram", link: "https://instagram.com/loremipsum" },
            { title: "Telegram", link: "@nickname" },
            { title: "Signal", link: "@nickname" },
          ]}
        />
      </View>
    </View>
  );
};

const InvestmentInformation: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingVertical: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Investment information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Box
          notched
          style={{
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 6,
            padding: 12,
            flex: 1,
            height: "100%",
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            Investment Description
          </BrandText>
          <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
            For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority. A minority of powerful & wealthy leaders, called the “The
            Legion'', have set up a technological & political system allowing
            them to continue to develop their wealth and safety.
          </BrandText>
        </Box>
        <LinkCard
          title="Other Links"
          linksData={[
            { title: "Instagram", link: "https://instagram.com/loremipsum" },
            { title: "Telegram", link: "@nickname" },
            { title: "Signal", link: "@nickname" },
          ]}
        />
        <LinkCard
          title="Whitepaper Roadmap"
          linksData={[
            { title: "Roadmap", link: "Link" },
            { title: "Whitepaper", link: "Link" },
            { title: "Pitch Deck", link: "Link" },
          ]}
        />
      </View>
    </View>
  );
};

const LinkCard: React.FC<{ title: any; linksData: any }> = ({
  title,
  linksData,
}) => {
  return (
    <Box
      notched
      style={{
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: 6,
        padding: 12,
        flex: 1,
        height: "100%",
      }}
    >
      <BrandText style={[fontSemibold12, { color: neutral77 }]}>
        {title}
      </BrandText>
      <FlatList
        data={linksData}
        renderItem={({ item, index }) => (
          <View style={{ marginTop: 6, flexDirection: "row" }} key={index}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {item?.title}
            </BrandText>
            <BrandText style={[fontSemibold14, { marginStart: 12 }]}>
              {item?.link}
            </BrandText>
          </View>
        )}
      />
    </Box>
  );
};
