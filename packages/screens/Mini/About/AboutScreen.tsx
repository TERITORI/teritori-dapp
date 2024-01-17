import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import externalLinkSVG from "../../../../assets/icons/external-grey.svg";
import teritoriSVG from "../../../../assets/icons/teritori-white.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBadge } from "../../../components/badges/TertiaryBadge";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontBold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import ListView from "../AddressBook/components/ListView";
import MiniHeader from "../Notifications/components/MiniHeader";
import { BlurScreenContainer } from "../components/BlurScreenContainer";

type AboutScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "About">;
};

const links = [
  {
    label: "Privacy Policy",
    url: "https:ggogle.com",
  },
  {
    label: "Terms of Use",
    url: "https:ggogle.com",
  },
  {
    label: "Help & Support",
    url: "https:ggogle.com",
  },
  {
    label: "GitHub",
    url: "https:ggogle.com",
  },
  {
    label: "Developer Docs",
    url: "https:ggogle.com",
  },
  {
    label: "Website",
    url: "https:ggogle.com",
  },
];

export default function AboutScreen({ navigation }: AboutScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <BlurScreenContainer
      background="transparent"
      customHeader={
        <MiniHeader
          headerStyle={{ backgroundColor: "transparent" }}
          navigation={navigation}
          backEnabled
          title="About Teritori"
          right={
            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} width={24} height={24} />
            </CustomPressable>
          }
        />
      }
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
          flex: 1,
        }}
      >
        <FlatList
          inverted
          data={links}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <ListView
              onPress={() => {}}
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
  );
}
