import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { Notifications } from "./components/Notifications";
import { SettingItem } from "./components/SettingItem";
import { useCommonStyles } from "./components/commonStyles";
import { SettingItemType } from "./types";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SpacerColumn } from "../../components/spacer";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  selectAreTestnetsEnabled,
  selectNFTStorageAPI,
  setAreTestnetsEnabled,
  setNFTStorageAPI,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutralA3, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";

const NFTAPIKeyInput: React.FC = () => {
  const NFTApiKey = useSelector(selectNFTStorageAPI);
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
          NFT.Storage/Pinata.cloud API key (for Social Feed)
        </BrandText>
        <Pressable
          onPress={() =>
            dispatch(setNFTStorageAPI(process.env.NFT_STORAGE_API || ""))
          }
        >
          <Text style={[fontSemibold14, { color: primaryColor }]}>
            Reset to Teritoris' API key
          </Text>
        </Pressable>
      </View>
      <SpacerColumn size={1.5} />
      <TextInput
        style={[commonStyles.apiInput]}
        value={NFTApiKey}
        onChangeText={(value) => dispatch(setNFTStorageAPI(value))}
      />
    </View>
  );
};

export const SettingsScreen: ScreenFC<"Settings"> = () => {
  const navigation = useAppNavigation();
  const commonStyles = useCommonStyles();
  const selectedWallet = useSelectedWallet();
  const isWalletConnected = !!selectedWallet;
  const testnetEnabled = useSelector(selectAreTestnetsEnabled);
  const dispatch = useAppDispatch();

  return (
    <ScreenContainer noMargin fullWidth>
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

        <NFTAPIKeyInput />

        <Notifications />

        <SpacerColumn size={4} />

        <View style={commonStyles.cardContainer}>
          <TouchableOpacity
            disabled={!isWalletConnected}
            onPress={() => navigation.navigate("TNSHome", { modal: "manage" })}
            style={{
              opacity: !isWalletConnected ? 0.5 : 1,
            }}
          >
            <View style={[commonStyles.switchBox, { paddingTop: 0 }]}>
              <BrandText style={commonStyles.cardTitle}>
                {isWalletConnected
                  ? "Customize my User Profile"
                  : "Customize my User Profile (Please connect wallet)"}
              </BrandText>

              <SVG source={chevronRightSVG} height={16} width={16} />
            </View>
          </TouchableOpacity>
        </View>
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
