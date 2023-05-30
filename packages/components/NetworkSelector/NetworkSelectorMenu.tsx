import React, { FC } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { useSwitchNetwork } from "../../hooks/useSwitchNetwork";
import {
  getNetwork,
  NetworkInfo,
  NetworkKind,
  selectableNetworks,
} from "../../networks";
import { selectAreTestnetsEnabled } from "../../store/slices/settings";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const NetworkSelectorMenu: FC<{
  forceNetworkIds?: string[];
  forceNetworkKind?: NetworkKind;
  style?: StyleProp<ViewStyle>;
}> = ({ forceNetworkIds, forceNetworkKind, style }) => {
  const { setToastError } = useFeedbacks();
  const testnetsEnabled = useSelector(selectAreTestnetsEnabled);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const switchNetwork = useSwitchNetwork();

  const onPressNetwork = (networkId: string) => {
    const network = getNetwork(networkId);
    if (!network) {
      setToastError({
        title: "Error",
        message: `unsupported network ${networkId}`,
      });
      return;
    }
    switchNetwork(network.id);
  };

  return (
    <TertiaryBox
      width={172}
      noBrokenCorners
      style={style}
      mainContainerStyle={{
        paddingHorizontal: layout.padding_x2,
        paddingTop: layout.padding_x2,
        backgroundColor: neutral17,
        alignItems: "flex-start",
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      {(process.env.DISPLAYED_NETWORKS_IDS || "")
        .split(",")
        .map((s) => s.trim())
        .map(getNetwork)
        .filter((n): n is NetworkInfo => !!n)
        .filter((network) => {
          return testnetsEnabled || !network.testnet;
        })
        .map((network, index) => {
          const selectable =
            !!selectableNetworks.find((sn) => sn.id === network.id) && // check that it's in the selectable list
            selectedNetworkInfo?.id !== network.id && // check that it's not already selected
            (!forceNetworkIds || forceNetworkIds.includes(network.id)) && // check that it's a forced network id if forced to
            (!forceNetworkKind || network.kind === forceNetworkKind); // check that it's the correct network kind if forced to

          return (
            <TouchableOpacity
              disabled={!selectable}
              style={{
                marginBottom: layout.padding_x2,
                opacity: selectable ? 1 : 0.5,
              }}
              key={index}
              onPress={() => onPressNetwork(network.id)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <NetworkIcon networkId={network.id} size={16} />
                <BrandText
                  style={[fontSemibold12, { marginLeft: layout.padding_x1_5 }]}
                >
                  {network?.displayName || "Unknown"}
                </BrandText>
              </View>
            </TouchableOpacity>
          );
        })}
    </TertiaryBox>
  );
};
