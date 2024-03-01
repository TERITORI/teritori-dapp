import { Pressable, View } from "react-native";

import { DropdownWithListItem } from "./DropdownWithListItem";
import { useSelectedNativeWallet } from "../../hooks/wallet/useSelectedNativeWallet";
import { getUserId } from "../../networks";
import { neutral00, secondaryColor } from "../../utils/style/colors";
import { fontSemibold18 } from "../../utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerRow } from "../spacer";

import ChatGraySVG from "@/assets/icons/chat-gray.svg";
import FriendGraySVG from "@/assets/icons/friend-gray.svg";
import notificationSVG from "@/assets/icons/notification-new.svg";
import OrganizationGraySVG from "@/assets/icons/organization-gray.svg";
import UserGraySVG from "@/assets/icons/user-gray.svg";
import GroupGraySVG from "@/assets/icons/users-group-gray.svg";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

type DefaultAppBarProps = {
  title: string;
};

const chatDropdownItems = [
  {
    icon: ChatGraySVG,
    name: "Create new conversation",
    onPress: (navigation: any) => navigation.navigate("MiniAddFriend"),
  },
  {
    icon: GroupGraySVG,
    name: "Create new group",
    onPress: (navigation: any) => navigation.navigate("MiniNewGroup"),
  },
  {
    icon: FriendGraySVG,
    name: "Add a friend",
    onPress: (navigation: any) => navigation.navigate("MiniFriend"),
  },
  {
    icon: OrganizationGraySVG,
    name: "Create an organization",
  },
  {
    icon: UserGraySVG,
    name: "My Teritori ID",
    onPress: (navigation: any) => navigation.navigate("MiniChatProfile"),
  },
];

const feedsDropdownItems = [
  {
    icon: ChatGraySVG,
    name: "Create Post",
    onPress: (navigation: any) => navigation.navigate("MiniCreatePost"),
  },
];

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
  const navigation = useAppNavigation();
  const wallet = useSelectedNativeWallet();
  const userId = getUserId(wallet?.networkId, wallet?.address);
  const onProfileImagePress = () => navigation.navigate("MiniProfile");

  const onPressNotification = () => {
    navigation.navigate("Notifications");
  };

  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        height: MOBILE_HEADER_HEIGHT,
        maxHeight: MOBILE_HEADER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x2,
        position: "absolute",
        top: 0,
        zIndex: 9999,
      }}
    >
      <CustomPressable onPress={onProfileImagePress}>
        <UserAvatarWithFrame
          userId={userId !== "" ? userId : "tori-"}
          size="S"
        />
      </CustomPressable>
      <BrandText
        style={[
          fontSemibold18,
          {
            color: secondaryColor,
            textAlign: "center",
          },
        ]}
      >
        {title}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable onPress={onPressNotification}>
          <SVG source={notificationSVG} width={22} height={22} />
        </Pressable>

        {title === "Chat" && (
          <>
            <SpacerRow size={2.75} />
            <DropdownWithListItem items={chatDropdownItems} iconSize={22} />
          </>
        )}

        {title === "Feeds" && (
          <>
            <SpacerRow size={2.75} />
            <DropdownWithListItem items={feedsDropdownItems} iconSize={22} />
          </>
        )}
      </View>
    </View>
  );
}
