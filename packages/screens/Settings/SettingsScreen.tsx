import React from "react";
import { TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import "../../weshnet/client";

import { Notifications } from "./components/Notifications";
import { SettingItem } from "./components/SettingItem";
import { useCommonStyles } from "./components/commonStyles";
import { SettingItemType } from "./types";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TertiaryButton } from "../../components/buttons/TertiaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { NetworksListModal } from "../../components/modals/NetworksListModal";
import { SpacerColumn } from "../../components/spacer";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import {
  selectAreTestnetsEnabled,
  selectIsLightTheme,
  selectNFTStorageAPI,
  setAreTestnetsEnabled,
  setIsLightTheme,
  setNFTStorageAPI,
} from "../../store/slices/settings";
import { RootState, useAppDispatch } from "../../store/store";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutralA3, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";

const NFTAPIKeyInput: React.FC = () => {
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const dispatch = useAppDispatch();
  const commonStyles = useCommonStyles();

  return (
    <View style={commonStyles.cardContainer}>
      <View style={[commonStyles.switchBox, { paddingTop: 0 }]}>
        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutralA3,
            },
          ]}
        >
          app.pinata.cloud JWT key (For file upload)
        </BrandText>
        <CustomPressable
          onPress={() =>
            // We ask key at each upload for now (Don't have Teritori's key for now)
            dispatch(setNFTStorageAPI(""))
          }
        >
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            Reset to Teritoris' API key
          </BrandText>
        </CustomPressable>
      </View>
      <SpacerColumn size={1.5} />
      <TextInput
        style={[commonStyles.apiInput]}
        value={userIPFSKey}
        onChangeText={(value) => dispatch(setNFTStorageAPI(value))}
      />
    </View>
  );
};

export const SettingsScreen: ScreenFC<"Settings"> = () => {
  const navigation = useAppNavigation();
  const commonStyles = useCommonStyles();
  const isKeplrConnected = useIsKeplrConnected();
  const testnetEnabled = useSelector(selectAreTestnetsEnabled);
  const dispatch = useAppDispatch();
  const [networksModalVisible, setNetworksModalVisible] = React.useState(false);
  const isLightTheme = useSelector(selectIsLightTheme);

  return (
    <ScreenContainer>
      <View style={commonStyles.pageContainer}>
        <View style={commonStyles.cardContainer}>
          <SettingItem
            onPress={(item: SettingItemType) => {
              dispatch(setAreTestnetsEnabled(!item.state));
            }}
            item={{
              title: "Display all Testnet Networks",
              description: "",
              state: testnetEnabled,
            }}
          />
        </View>

        <SpacerColumn size={3} />

        <TertiaryButton
          text="Manage Networks"
          size="M"
          onPress={() => {
            setNetworksModalVisible(true);
          }}
          fullWidth
        />
        <NetworksListModal
          isVisible={networksModalVisible}
          onClose={() => {
            setNetworksModalVisible(false);
          }}
        />

        <SpacerColumn size={3} />

        <NFTAPIKeyInput />

        <Notifications />

        <SpacerColumn size={4} />

        <View style={commonStyles.cardContainer}>
          <TouchableOpacity
            disabled={!isKeplrConnected}
            onPress={() => navigation.navigate("TNSHome", { modal: "manage" })}
            style={{
              opacity: !isKeplrConnected ? 0.5 : 1,
            }}
          >
            <View style={[commonStyles.switchBox, { paddingTop: 0 }]}>
              <BrandText style={commonStyles.cardTitle}>
                {isKeplrConnected
                  ? "Customize my User Profile"
                  : "Customize my User Profile (Please connect wallet)"}
              </BrandText>

              <SVG source={chevronRightSVG} height={16} width={16} />
            </View>
          </TouchableOpacity>
        </View>

        <SpacerColumn size={4} />

        <View style={commonStyles.cardContainer}>
          <SettingItem
            onPress={() => {
              dispatch(setIsLightTheme(!isLightTheme));
            }}
            item={{
              title: "Experimental Light theme",
              description: "Light theme",
              state: isLightTheme,
            }}
          />
        </View>

        <SpacerColumn size={4} />

        <WeshnetStateButton />

        {/*Please note that the "user profile customization" part of this task was changed to navigate to the TNS manage page.*/}
        {/*I left the files ( committed to the repo UserProfileModal.tsx) as by the previous developer.*/}
        {/*<UserProfileModal*/}
        {/*  visible={openProfile}*/}
        {/*  onClose={toggleUserProfileModal}*/}
        {/*/>*/}
      </View>
    </ScreenContainer>
  );
};

const WeshnetStateButton: React.FC = () => {
  const state = useSelector((state: RootState) => state.message);
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <>
      <PrimaryButton
        size="M"
        text="Weshnet State"
        fullWidth
        onPress={() => setModalVisible(true)}
      />
      <ModalBase
        label="Weshnet"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        scrollable
      >
        <BrandText>{JSON.stringify(state, null, 2)}</BrandText>
      </ModalBase>
    </>
  );
};
