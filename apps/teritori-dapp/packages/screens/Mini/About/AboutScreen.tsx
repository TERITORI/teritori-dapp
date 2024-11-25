import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

import externalLinkSVG from "@/assets/icons/external-grey.svg";
import teritoriSVG from "@/assets/icons/teritori-white.svg";
import ListView from "../components/ListView";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import BackSVG from "@/assets/icons/back.svg";
import { BrandText } from "@/components/BrandText";
import { EmbeddedWeb } from "@/components/EmbeddedWeb";
import { SVG } from "@/components/SVG";
import { TertiaryBadge } from "@/components/badges/TertiaryBadge";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn } from "@/components/spacer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { RootStackParamList } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontBold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type AboutScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "About">;
};

const links = [
  {
    label: "Privacy Policy",
    url: "https://teritori.notion.site/Privacy-Policy-16e2332744d346db9b78909a91cb44e3",
  },
  {
    label: "Terms of Use",
    url: "https://teritori.notion.site/Terms-Conditions-6007160a0c74472cbb75a07bdfdd5f73",
  },
  {
    label: "Help & Support",
    url: "https://discord.com/invite/teritori",
  },
  {
    label: "GitHub",
    url: "https://github.com/TERITORI/teritori-dapp",
  },
  {
    label: "Developer Docs",
    url: "https://github.com/TERITORI/documentation",
  },
  {
    label: "Website",
    url: "https://teritori.com/",
  },
];

export default function AboutScreen({ navigation }: AboutScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs", { screen: "MiniChats" });

  const isMobile = useIsMobile();
  const seasonVideoHeight = isMobile ? 214 : 293;
  const seasonVideoWidth = isMobile ? 400 : 516;

  const [url, setUrl] = useState("");

  return (
    <>
      {url ? (
        <SafeAreaView style={{ flex: 1 }}>
          <CustomPressable
            onPress={() => {
              setUrl("");
            }}
            style={{
              marginLeft: 15,
              backgroundColor: "#000",
              paddingVertical: 8,
            }}
          >
            <SVG source={BackSVG} height={28} width={28} />
          </CustomPressable>
          <EmbeddedWeb
            uri={url}
            width={seasonVideoWidth - 2}
            height={seasonVideoHeight}
          />
        </SafeAreaView>
      ) : (
        <BlurScreenContainer
          title="About Teritori"
          onGoBack={onClose}
          noScrollView
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SpacerColumn size={3} />
            <SVG source={teritoriSVG} fontSize={64} />
            <SpacerColumn size={1} />
            <BrandText style={fontBold16}>TERITORI</BrandText>
            <SpacerColumn size={1} />
            <TertiaryBadge label="v1.25" textColor={neutral77} />
            <SpacerColumn size={6} />
          </View>

          <View
            style={{
              justifyContent: "space-between",
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: layout.spacing_x2,
              flex: 1,
            }}
          >
            <FlatList
              inverted
              data={links}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <ListView
                  onPress={() => {
                    setUrl(item?.url);
                  }}
                  style={{
                    paddingHorizontal: layout.spacing_x1_5,
                  }}
                  options={{
                    label: item?.label,
                    iconEnabled: true,
                    iconOptions: {
                      icon: externalLinkSVG,
                    },
                  }}
                />
              )}
            />
          </View>
        </BlurScreenContainer>
      )}
    </>
  );
}
