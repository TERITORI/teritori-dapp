import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { MainConnectWalletButton } from "../../components/connectWallet/MainConnectWalletButton";
import { useBalances } from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { allNetworks, getNetwork, isTestMode } from "../../networks";
import { osmosisNetwork } from "../../networks/osmosis";
import { osmosisTestnetNetwork } from "../../networks/osmosis-testnet";
import {
  selectSelectedNetworkId,
  setSelectedNetworkId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ScreenFC } from "../../utils/navigation";
import { Assets } from "../WalletManager/Assets";
import { ConnectModal } from "./components/ConnectModal";
import { SwapModal } from "./components/SwapModal";

export const SwapScreen: ScreenFC<"Swap"> = () => {
  const selectedWallet = useSelectedWallet();

  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const dispatch = useAppDispatch();

  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);

  const balances = useBalances(selectedNetworkId, selectedWallet?.address);

  const osmosisConnected =
    selectedNetwork?.displayName === osmosisTestnetNetwork.displayName || selectedNetwork?.displayName === osmosisNetwork.displayName

  const onPressConnect = () => {
    const osmosisNetworkId =
      allNetworks.find(
        (networkInfo) =>
          networkInfo.displayName === osmosisNetwork.displayName
      )?.id || "";
    dispatch(setSelectedNetworkId(osmosisNetworkId));
    setConnectModalVisible(false);
  };
  const onPressConnectTestnet = () => {
    const osmosisTestnetNetworkId =
      allNetworks.find(
        (networkInfo) =>
          networkInfo.displayName === osmosisTestnetNetwork.displayName
      )?.id || "";
    dispatch(setSelectedNetworkId(osmosisTestnetNetworkId));
    setConnectModalVisible(false);
  };

  useEffect(() => {
    if (osmosisConnected) setConnectModalVisible(false);
    else setConnectModalVisible(true);
  }, [osmosisConnected]);

  return (
    <ScreenContainer headerChildren={<BrandText>Swap</BrandText>}>
      <View style={styles.mainContainer}>
        {!selectedWallet?.address ? (
          <MainConnectWalletButton style={{ alignSelf: "center" }} />
        ) : osmosisConnected ? (
          <>
            <PrimaryButton
              size="XL"
              text="Swap"
              onPress={() => setSwapModalVisible(true)}
              touchableStyle={styles.primaryButton}
            />
            <Assets
              networkId={selectedNetworkId}
              balances={balances}
              style={styles.assets}
            />
          </>
        ) : (
          <PrimaryButton
            size="XL"
            text="Connect to OSMOSIS"
            onPress={() => setConnectModalVisible(true)}
            touchableStyle={styles.primaryButton}
          />
        )}
      </View>

      <SwapModal
        visible={swapModalVisible}
        onClose={() => setSwapModalVisible(false)}
      />
      <ConnectModal
        onPressConnect={onPressConnect}
        onPressConnectTestnet={onPressConnectTestnet}
        visible={!!selectedWallet?.address && connectModalVisible}
        onClose={() => setConnectModalVisible(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 140,
  },
  primaryButton: {
    alignSelf: "center",
  },
  assets: {
    borderTopWidth: 0,
  },
});
