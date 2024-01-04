import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { SearchChatList } from "./components/SearchChatList";
import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import {
  fontBold11,
  fontMedium16,
  fontSemibold18,
} from "../../../utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../utils/style/layout";

const fake_url =
  "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg";

export const NewConversationScreen: ScreenFC<"MiniNewConversation"> = ({
  navigation,
}) => {
  const [search, setSearch] = useState("");

  const onClose = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0,0.95)",
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: layout.spacing_x1_5,
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold18]}>New conversation</BrandText>

          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>
        <ScrollView style={{}}>
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{ backgroundColor: "#000" }}>
              <SearchChatList
                setValue={setSearch}
                value={search}
                style={{
                  backgroundColor: "rgba(118, 118, 128, 0.24)",
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: layout.spacing_x2_5,
                }}
              />
              <IndividualFriendName avatar={fake_url} id="1" name="Albert" />
              <IndividualFriendName avatar={fake_url} id="1" name="Albert" />
              <IndividualFriendName avatar={fake_url} id="1" name="Albert" />
              <IndividualFriendName avatar={fake_url} id="1" name="Albert" />
            </View>
          </View>
        </ScrollView>
        <AlbhabetsSelector />
      </View>
    </SafeAreaView>
  );
};

type IndividualFriendNameProps = {
  avatar: string;
  name: string;
  id: string;
};
const IndividualFriendName = ({
  avatar,
  id,
  name,
}: IndividualFriendNameProps) => {
  const navigation = useAppNavigation();

  const onFriendNamePress = () =>
    navigation.navigate("Conversation", { conversationId: id });
  return (
    <CustomPressable
      onPress={onFriendNamePress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: layout.spacing_x2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        <OptimizedImage
          width={22}
          height={22}
          sourceURI={avatar}
          style={{
            width: 22,
            height: 22,
            borderRadius: 22 / 2,
          }}
        />
        <BrandText style={[fontMedium16, { lineHeight: 22 }]}>{name}</BrandText>
      </View>
      <SVG source={chevronGrayRightSVG} height={24} width={24} />
    </CustomPressable>
  );
};

const alphabet = "abcdefghijklmnopqrstuvwxyz#149".split("");

const AlbhabetsSelector = () => {
  return (
    <View
      style={{
        gap: layout.spacing_x1,
        position: "absolute",
        right: 0,
        top: MOBILE_HEADER_HEIGHT + 70,
      }}
    >
      {Array.isArray(alphabet) &&
        alphabet.map((alph) => (
          <BrandText style={[fontBold11]}>{alph.toUpperCase()}</BrandText>
        ))}
    </View>
  );
};
