import { View, Image, Pressable } from "react-native";

import ChatGraySVG from "../../../../../assets/icons/chat-gray.svg";
import FriendGraySVG from "../../../../../assets/icons/friend-gray.svg";
import NotificationSVG from "../../../../../assets/icons/notification-new.svg";
import OrganizationGraySVG from "../../../../../assets/icons/organization-gray.svg";
import GroupGraySVG from "../../../../../assets/icons/users-group-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { useAppNavigation } from "../../../../utils/navigation";
import { neutral00, secondaryColor } from "../../../../utils/style/colors";
import { fontSemibold18 } from "../../../../utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../../utils/style/layout";
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
  },
  {
    icon: OrganizationGraySVG,
    name: "Create an organization",
  },
];

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
  const navigation = useAppNavigation();

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
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={{ height: 32, width: 32, borderRadius: 16 }}
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
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={onPressNotification}
          style={{ paddingHorizontal: layout.spacing_x2 }}
        >
          <NotificationSVG />
        </Pressable>
        <DropdownWithListItem items={dropdownItems} />
      </View>
    </View>
  );
}
