import React, { useMemo } from "react";
import {
  Pressable,
  StyleProp,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { Notifications } from "./components/Notifications";
import { SettingItem } from "./components/SettingItem";
import { useCommonStyles } from "./components/commonStyles";
import { SettingItemType } from "./types";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../components/BrandText";
import { NetworkIcon } from "../../components/NetworkIcon";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { allNetworks, getNetwork } from "../../networks";
import {
  selectAreTestnetsEnabled,
  selectNFTStorageAPI,
  selectNetworkEnabled,
  setAreTestnetsEnabled,
  setNFTStorageAPI,
  toggleNetwork,
} from "../../store/slices/settings";
import { RootState, useAppDispatch } from "../../store/store";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { joinElements } from "../Multisig/components/MultisigRightSection";

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
        <Pressable
          onPress={() =>
            // We ask key at each upload for now (Don't have Teritori's key for now)
            dispatch(setNFTStorageAPI(""))
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

        <NetworksSettings />

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

const NetworksSettings: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const areTestnetsEnabled = useSelector(selectAreTestnetsEnabled);
  const results = useMemo(() => {
    const searchTerms = searchTerm
      .split(" ")
      .filter((s) => !!s)
      .map((s) => s.toLowerCase());
    return allNetworks.filter((network) => {
      if (!areTestnetsEnabled && network.testnet) return false;
      const dn = network.displayName.toLowerCase();
      return searchTerms.every((searchTerm) => dn.includes(searchTerm));
    });
  }, [searchTerm, areTestnetsEnabled]);
  return (
    <View style={style}>
      <TextInputCustom
        label="Networks"
        name="networks"
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search for a network to enable or disable it"
      />
      {searchTerm && (
        <>
          <SpacerColumn size={2} />
          {joinElements(
            results.map((n) => <NetworkSettings key={n.id} networkId={n.id} />),
            <SpacerColumn size={1} />
          )}
        </>
      )}
    </View>
  );
};

const NetworkSettings: React.FC<{ networkId: string }> = ({ networkId }) => {
  const state = useSelector((state: RootState) =>
    selectNetworkEnabled(state, networkId)
  );
  const dispatch = useAppDispatch();
  const n = getNetwork(networkId);
  if (!n) return null;
  return (
    <TertiaryBox fullWidth mainContainerStyle={{ padding: layout.padding_x1 }}>
      <TouchableOpacity
        onPress={() => {
          dispatch(toggleNetwork({ networkId }));
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <NetworkIcon networkId={n.id} size={20} />
          <SpacerRow size={1} />
          <BrandText style={fontSemibold14} key={n.id}>
            {n.displayName}
          </BrandText>
        </View>
        <Switch
          // @ts-expect-error
          activeThumbColor={primaryColor}
          thumbColor={state ? primaryColor : neutral55}
          trackColor={{ true: secondaryColor, false: neutralA3 }}
          value={state}
        />
      </TouchableOpacity>
    </TertiaryBox>
  );
};
