import { FC, useState } from "react";
import { Switch, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { SettingBase } from "./components/SettingBase";
import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import dataCabinetSVG from "../../../../assets/icons/data-cabinet.svg";
import laptopSVG from "../../../../assets/icons/laptop.svg";
import lockSVG from "../../../../assets/icons/lock-white.svg";
import profileSVG from "../../../../assets/icons/profile-circle-white.svg";
import warningSVG from "../../../../assets/icons/warning-circular-orange.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import {
  RouteName,
  ScreenFC,
  useAppNavigation,
} from "../../../utils/navigation";
import {
  blueDefault,
  neutral33,
  neutral77,
  neutral99,
} from "../../../utils/style/colors";
import { fontMedium13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const ChatSettingScreen: ScreenFC<"MiniChatSetting"> = ({
  navigation,
}) => {
  const [isChatEnabled, setIsChatEnabled] = useState(true);

  const onToggleChatSwitch = () => setIsChatEnabled((prev) => !prev);
  const navigateToSettings = () => navigation.replace("MiniSettings");

  return (
    <SettingBase title="Chat Setting" onGoBack={navigateToSettings}>
      <ChatSettingMenuItem
        icon={profileSVG}
        navigateTo="MiniProfileDetail"
        title="Profile"
      />
      <ChatSettingMenuItem
        icon={laptopSVG}
        navigateTo="MiniChats"
        title="Devices"
      />
      <Separator />
      <ChatSettingMenuItem
        icon={profileSVG}
        navigateTo="MiniChats"
        title="Notifications"
      />
      <ChatSettingMenuItem
        icon={lockSVG}
        navigateTo="MiniChats"
        title="Privacy"
      />
      <ChatSettingMenuItem
        icon={dataCabinetSVG}
        navigateTo="MiniChats"
        title="Data Usage"
      />
      <Separator />
      <View
        style={{
          paddingBottom: layout.spacing_x2,
          paddingHorizontal: layout.spacing_x2,
          marginTop: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            marginBottom: layout.spacing_x1_5,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: layout.spacing_x1_5,
            }}
          >
            <SVG source={warningSVG} height={24} width={24} />
            <BrandText>Force turn on Chats tab</BrandText>
          </View>
          <Switch
            ios_backgroundColor={isChatEnabled ? blueDefault : neutral33}
            trackColor={{ false: neutral33, true: blueDefault }}
            thumbColor={isChatEnabled ? "#fff" : neutral99}
            onValueChange={onToggleChatSwitch}
            value={isChatEnabled}
          />
        </View>
        <BrandText style={[fontMedium13, { color: neutral77 }]}>
          Chats feature will always be activated. If this setting enabled, your
          device will run out of battery faster.
        </BrandText>
      </View>
    </SettingBase>
  );
};

type MenuItemProps = {
  icon: string | FC<SvgProps>;
  title: string;
  navigateTo: RouteName;
};
const ChatSettingMenuItem = ({ icon, navigateTo, title }: MenuItemProps) => {
  const navigation = useAppNavigation();
  const onMenuItemPress = () => {
    navigation.replace(navigateTo);
  };
  return (
    <CustomPressable onPress={onMenuItemPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: layout.spacing_x2,
          marginBottom: layout.spacing_x1_5,
        }}
      >
        <View style={{ flexDirection: "row", gap: layout.spacing_x1_5 }}>
          <SVG source={icon} height={24} width={24} />
          <BrandText>{title}</BrandText>
        </View>
        <SVG source={chevronGrayRightSVG} height={24} width={24} />
      </View>
    </CustomPressable>
  );
};
