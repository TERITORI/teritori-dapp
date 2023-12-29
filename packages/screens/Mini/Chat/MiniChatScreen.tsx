import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import closeSVG from "../../../../assets/icons/close.svg";
import friendSVG from "../../../../assets/icons/friend.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { MiniScreenFC } from "../../../components/navigation/MiniNavigator";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import {
  neutral22,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold14,
  fontSemibold18,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const collectionScreenTabItems = {
  chats: {
    name: "Chats",
  },
  multiChannels: {
    name: "Multichannels",
  },
};

const DATA = [
  {
    id: "1",
    title: "Add a friend",
    icon: friendSVG,
  },
  {
    id: "2",
    title: "New Conversation",
    icon: friendSVG,
  },
  {
    id: "3",
    title: "New Group",
    icon: friendSVG,
  },
];

type ItemProps = { title: string; icon: React.FC<SvgProps> };

const Item = ({ title, icon }: ItemProps) => (
  <View
    style={[
      fontSemibold14,
      {
        backgroundColor: neutral22,
        width: 140,
        marginRight: 9,
        paddingHorizontal: layout.spacing_x0_5,
        paddingTop: layout.spacing_x0_5,
        paddingBottom: layout.spacing_x1_5,
        borderRadius: 10,
      },
    ]}
  >
    <View
      style={{ alignItems: "flex-end", position: "absolute", right: 4, top: 4 }}
    >
      <TouchableOpacity
        style={{
          height: 24,
          width: 24,
          borderRadius: 50,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVG source={closeSVG} height={12} width={12} />
      </TouchableOpacity>
    </View>
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: layout.spacing_x2_5,
        paddingTop: layout.spacing_x0_5,
      }}
    >
      <SVG source={icon} height={48} width={48} />
      <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
        {title}
      </BrandText>
    </View>
  </View>
);

export const MiniChatScreen: MiniScreenFC<"MiniChats"> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("chats");
  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Chats"
    >
      <RoundedTabs
        items={collectionScreenTabItems}
        onSelect={(key) => setSelectedTab(key)}
        selected={selectedTab}
        style={{
          height: 48,
          maxHeight: 48,
          marginTop: layout.spacing_x2,
        }}
      />
      <View style={{ flex: 1, height: 900 }}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <BrandText
            style={[fontMedium16, { textAlign: "center", color: neutral77 }]}
          >
            No chats yet.
          </BrandText>
          <BrandText
            style={[fontMedium16, { textAlign: "center", color: neutral77 }]}
          >
            Get Started by messaging a friend.
          </BrandText>
        </View>

        <View>
          <BrandText
            style={[
              fontSemibold18,
              { color: secondaryColor, marginBottom: 12 },
            ]}
          >
            Get Started
          </BrandText>
          <FlatList
            horizontal
            data={DATA}
            renderItem={({ item }) => (
              <Item title={item.title} icon={item.icon} />
            )}
            keyExtractor={(item) => item.id}
            style={{ marginBottom: 16 }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
