import { FC, useState } from "react";
import { Dimensions, Switch, View } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronGrayRightSVG from "../../../../../../assets/icons/chevron-right-gray.svg";
import dataCabinetSVG from "../../../../../../assets/icons/data-cabinet.svg";
import laptopSVG from "../../../../../../assets/icons/laptop.svg";
import lockSVG from "../../../../../../assets/icons/lock-white.svg";
import profileSVG from "../../../../../../assets/icons/profile-circle-white.svg";
import warningSVG from "../../../../../../assets/icons/warning-circular-orange.svg";
import { BrandText } from "../../../../../components/BrandText";
import { SVG } from "../../../../../components/SVG";
import { CustomPressable } from "../../../../../components/buttons/CustomPressable";
import TranslucentModal from "../../../../../components/modals/TranslucentModal";
import { Separator } from "../../../../../components/separators/Separator";
import { RouteName, useAppNavigation } from "../../../../../utils/navigation";
import {
  blueDefault,
  neutral33,
  neutral77,
  neutral99,
} from "../../../../../utils/style/colors";
import { fontMedium13 } from "../../../../../utils/style/fonts";
import {
  MOBILE_HEADER_HEIGHT,
  layout,
} from "../../../../../utils/style/layout";

type Props = {
  isVisible: boolean;
  toggleModal: () => void;
};
export const ChatSetting = ({ toggleModal, isVisible }: Props) => {
  const [isChatEnabled, setIsChatEnabled] = useState(true);

  const onToggleChatSwitch = () => setIsChatEnabled((prev) => !prev);
  const toggleChatSettingModal = () => toggleModal();

  return (
    <TranslucentModal
      isVisible={isVisible}
      onClose={toggleChatSettingModal}
      onBackPress={toggleChatSettingModal}
      title="Chat Setting"
    >
      <View
        style={[
          {
            flex: 1,
            paddingTop: MOBILE_HEADER_HEIGHT,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#000",
            }}
          >
            <ChatSettingMenuItem
              icon={profileSVG}
              navigateTo="MiniProfile"
              title="Profile"
              toggleModal={toggleModal}
            />
            <ChatSettingMenuItem
              icon={laptopSVG}
              navigateTo="MiniChats"
              title="Devices"
              toggleModal={toggleModal}
            />
            <Separator />
            <ChatSettingMenuItem
              icon={profileSVG}
              navigateTo="MiniChats"
              title="Notifications"
              toggleModal={toggleModal}
            />
            <ChatSettingMenuItem
              icon={lockSVG}
              navigateTo="MiniChats"
              title="Privacy"
              toggleModal={toggleModal}
            />
            <ChatSettingMenuItem
              icon={dataCabinetSVG}
              navigateTo="MiniChats"
              title="Data Usage"
              toggleModal={toggleModal}
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
                Chats feature will always be activated. If this setting enabled,
                your device will run out of battery faster.
              </BrandText>
            </View>
          </View>
        </View>
      </View>
    </TranslucentModal>
  );
};

type MenuItemProps = {
  icon: string | FC<SvgProps>;
  title: string;
  navigateTo: RouteName;
  toggleModal: () => void;
};
const ChatSettingMenuItem = ({
  icon,
  navigateTo,
  title,
  toggleModal,
}: MenuItemProps) => {
  const navigation = useAppNavigation();
  const onMenuItemPress = () => {
    //@ts-expect-error
    navigation.navigate(navigateTo);
    toggleModal();
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
