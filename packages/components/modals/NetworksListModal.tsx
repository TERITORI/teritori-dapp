import React, { FC, memo, useMemo, useState } from "react";
import {
  StyleProp,
  Switch,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import ModalBase from "./ModalBase";
import { allNetworks, getNetwork } from "../../networks";
import { joinElements } from "../../screens/Multisig/components/MultisigRightSection";
import {
  selectAreTestnetsEnabled,
  selectNetworkEnabled,
  toggleNetwork,
} from "../../store/slices/settings";
import { RootState, useAppDispatch } from "../../store/store";
import {
  primaryColor,
  neutral55,
  secondaryColor,
  neutralA3,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { EmptyList } from "../EmptyList";
import { NetworkIcon } from "../NetworkIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../spacer";

export const NetworksListModal: FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  return (
    <ModalBase
      scrollable
      label="Manage Networks"
      visible={isVisible}
      onClose={onClose}
      boxStyle={{ minWidth: 360, paddingBottom: modalMarginPadding }}
    >
      <NetworksSettings />
    </ModalBase>
  );
};

const NetworksSettings: FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const areTestnetsEnabled = useSelector(selectAreTestnetsEnabled);
  const results = useMemo(() => {
    const searchTerms = searchTerm
      .split(" ")
      .filter((s) => !!s)
      .map((s) => s.toLowerCase());
    if (searchTerms.length === 0) return allNetworks;
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
      <SpacerColumn size={2} />
      {results.length ? (
        joinElements(
          results.map((n) => (
            <NetworkSettingsItem key={n.id} networkId={n.id} />
          )),
          <SpacerColumn size={1.5} />,
        )
      ) : (
        <EmptyList text="No result" />
      )}
    </View>
  );
};

const NetworkSettingsItem: FC<{ networkId: string }> = memo(({ networkId }) => {
  const state = useSelector((state: RootState) =>
    selectNetworkEnabled(state, networkId),
  );
  const dispatch = useAppDispatch();
  const n = getNetwork(networkId);
  if (!n) return null;
  return (
    <TertiaryBox style={{ padding: layout.spacing_x1 }}>
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
          <BrandText
            style={[fontSemibold14, { maxWidth: 216 }]}
            key={n.id}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {n.displayName}
          </BrandText>
        </View>
        <SpacerRow size={1} />
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
});
