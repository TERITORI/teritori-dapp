import React, { FC, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { useDropdowns } from "../../context/DropdownsProvider";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWallets } from "../../context/WalletsProvider";
import { useEnabledNetworks } from "../../hooks/useEnabledNetworks";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { getNetwork, NetworkFeature, NetworkKind } from "../../networks";
import {
  setSelectedNetworkId,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { env } from "../../utils/env";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { WalletProvider } from "../../utils/walletProvider";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { TertiaryButton } from "../buttons/TertiaryButton";
import { NetworksListModal } from "../modals/NetworksListModal";

export const NetworkSelectorMenu: FC<{
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
  style?: StyleProp<ViewStyle>;
}> = ({ forceNetworkId, forceNetworkKind, forceNetworkFeatures, style }) => {
  const { closeOpenedDropdown } = useDropdowns();
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();
  const { setToastError } = useFeedbacks();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const [networksModalVisible, setNetworksModalVisible] = useState(false);
  const enabledNetworks = useEnabledNetworks();
  const isMobile = useIsMobile();

  const onPressNetwork = (networkId: string) => {
    let walletProvider: WalletProvider | null = null;

    const network = getNetwork(networkId);
    if (!network) {
      setToastError({
        title: "Error",
        message: `unsupported network ${networkId}`,
      });
      return;
    }

    switch (network.kind) {
      case NetworkKind.Ethereum:
        walletProvider = WalletProvider.Metamask;
        break;
      case NetworkKind.Cosmos:
        walletProvider = WalletProvider.Keplr;
        break;
    }

    // Auto select the first connected wallet when switching network
    dispatch(setSelectedNetworkId(networkId));

    const selectedWallet = wallets.find(
      (w) => w.connected && w.provider === walletProvider
    );

    dispatch(setSelectedWalletId(selectedWallet?.id || ""));

    closeOpenedDropdown();
  };

  return (
    <TertiaryBox
      width={172}
      noBrokenCorners
      style={style}
      mainContainerStyle={[
        {
          paddingHorizontal: layout.spacing_x2,
          paddingTop: layout.spacing_x2,
          backgroundColor: neutral17,
          alignItems: "flex-start",
        },
        isMobile && {
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      ]}
    >
      {enabledNetworks
        .filter((network) => {
          return (
            (!forceNetworkId || network.id === forceNetworkId) && // check that it's the forced network id if forced to
            (!forceNetworkKind || network.kind === forceNetworkKind) && // check that it's the correct network kind if forced to
            (!forceNetworkFeatures ||
              forceNetworkFeatures.every((feature) =>
                network.features.includes(feature)
              )) &&
            selectedNetworkInfo?.id !== network.id // check that it's not already selected
          );
        })
        .map((network, index) => {
          const selectable = true;
          return (
            <TouchableOpacity
              disabled={!selectable}
              style={{
                marginBottom: layout.spacing_x2,
                opacity: selectable ? 1 : 0.5,
              }}
              key={index}
              onPress={() => onPressNetwork(network.id)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <NetworkIcon networkId={network.id} size={16} />
                <BrandText
                  style={[fontSemibold12, { marginLeft: layout.spacing_x1_5 }]}
                >
                  {network?.displayName || "Unknown"}
                </BrandText>
              </View>
            </TouchableOpacity>
          );
        })}
      <TertiaryButton
        text="Manage"
        size="XS"
        squaresBackgroundColor={neutral17}
        style={{ marginBottom: layout.spacing_x2 }}
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
    </TertiaryBox>
  );
};
