import { View } from "react-native";
import { useSelector } from "react-redux";

import dataCabinetSVG from "../../../../assets/icons/data-cabinet.svg";
import laptopSVG from "../../../../assets/icons/laptop.svg";
import lockSVG from "../../../../assets/icons/lock-white.svg";
import profileSVG from "../../../../assets/icons/profile-circle-white.svg";
import warningSVG from "../../../../assets/icons/warning-circular-orange.svg";
import ToggleButton from "../../../components/buttons/ToggleButton";
import { SettingMenuItem } from "../components/SettingMenuItems";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import {
  selectIsChatActivated,
  setIsChatActivated,
} from "@/store/slices/settings";
import { store } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { checkAndBootWeshModule, stopWeshModule } from "@/weshnet/services";

export const ChatSettingScreen: ScreenFC<"MiniChatSetting"> = ({
  navigation,
}) => {
  const navigateToSettings = () => navigation.replace("MiniSettings");
  const isChatActivated = useSelector(selectIsChatActivated);

  function toggleChat(value: boolean) {
    store.dispatch(setIsChatActivated(value));
    if (value) {
      checkAndBootWeshModule();
    } else {
      stopWeshModule();
    }
  }

  return (
    <BlurScreenContainer title="Chat Setting" onGoBack={navigateToSettings}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <SettingMenuItem
          icon={profileSVG}
          navigateTo="MiniProfileDetail"
          title="Profile"
        />
        <SpacerColumn size={1} />
        <SettingMenuItem
          icon={laptopSVG}
          navigateTo="MiniChats"
          title="Devices"
        />
        <SpacerColumn size={2} />
        <Separator />
        <SpacerColumn size={2} />
        <SettingMenuItem
          icon={profileSVG}
          navigateTo="MiniChats"
          title="Notifications"
        />
        <SpacerColumn size={1} />
        <SettingMenuItem
          icon={lockSVG}
          navigateTo="MiniChats"
          title="Privacy"
        />
        <SpacerColumn size={1} />
        <SettingMenuItem
          icon={dataCabinetSVG}
          navigateTo="MiniChats"
          title="Data Usage"
        />
        <SpacerColumn size={2} />
        <Separator />
        <View>
          <SpacerColumn size={3} />
          <View
            style={{
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

            <ToggleButton
              isActive={isChatActivated}
              onValueChange={toggleChat}
            />
          </View>
          <SpacerColumn size={1} />
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            Chats feature will always be activated. If this setting enabled,
            your device will run out of battery faster.
          </BrandText>
        </View>
      </View>
    </BlurScreenContainer>
  );
};
