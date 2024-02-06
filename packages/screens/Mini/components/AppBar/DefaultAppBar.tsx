import { Pressable, View } from "react-native";

import ChatGraySVG from "../../../../../assets/icons/chat-gray.svg";
import FriendGraySVG from "../../../../../assets/icons/friend-gray.svg";
import notificationSVG from "../../../../../assets/icons/notification-new.svg";
import OrganizationGraySVG from "../../../../../assets/icons/organization-gray.svg";
import GroupGraySVG from "../../../../../assets/icons/users-group-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { UserAvatarWithFrame } from "../../../../components/images/AvatarWithFrame";
import { SpacerRow } from "../../../../components/spacer";
import { getUserId } from "../../../../networks";
import { useAppNavigation } from "../../../../utils/navigation";
import { neutral00, secondaryColor } from "../../../../utils/style/colors";
import { fontSemibold18 } from "../../../../utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "../../../../utils/style/layout";
import { useSelectedNativeWallet } from "../../../Wallet/hooks/useSelectedNativeWallet";
import { DropdownWithListItem } from "../Dropdown/DropdownWithListItem";

type DefaultAppBarProps = {
  title: string;
};

const dropdownItems = [
  {
    icon: ChatGraySVG,
    name: "Create new conversation",
    onPress: (navigation: any) => navigation.navigate("MiniNewConversation"),
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
            flex: 1,
            textAlign: "center",
            transform: [{ translateX: 30 }],
          },
        ]}
      >
        {title}
      </BrandText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable onPress={onPressNotification}>
          <SVG source={notificationSVG} width={22} height={22} />
        </Pressable>
        <SpacerRow size={2.75} />
        <DropdownWithListItem items={dropdownItems} iconSize={22} />
      </View>
    </View>
  );
}
