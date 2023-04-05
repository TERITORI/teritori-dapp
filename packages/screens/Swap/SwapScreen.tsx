import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ConnectModal } from "./components/ConnectModal";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { MainConnectWalletButton } from "../../components/connectWallet/MainConnectWalletButton";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { osmosisNetwork } from "../../networks/osmosis";
import { osmosisTestnetNetwork } from "../../networks/osmosis-testnet";
import { setSelectedNetworkId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ScreenFC } from "../../utils/navigation";
import { Assets } from "../WalletManager/Assets";

export const SwapScreen: ScreenFC<"Swap"> = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const isScreenFocused = useIsFocused();
  const SwapView = React.lazy(() =>
    import("./components/SwapView").then((module) => ({
      default: module.SwapView,
    }))
  );

  const osmosisConnected = useMemo(
    () =>
      selectedNetwork?.id === osmosisTestnetNetwork.id ||
      selectedNetwork?.id === osmosisNetwork.id,
    [selectedNetwork?.id]
  );

  const onPressConnect = () => {
    dispatch(setSelectedNetworkId(osmosisNetwork.id));
    setConnectModalVisible(false);
  };
  const onPressConnectTestnet = () => {
    dispatch(setSelectedNetworkId(osmosisTestnetNetwork.id));
    setConnectModalVisible(false);
  };

  useEffect(() => {
    if (osmosisConnected || !isScreenFocused) setConnectModalVisible(false);
    else setConnectModalVisible(true);
  }, [osmosisConnected, isScreenFocused]);

  return (
    <ScreenContainer headerChildren={<BrandText>Swap</BrandText>}>
      <View style={styles.mainContainer}>
        {!selectedWallet?.address ? (
          <MainConnectWalletButton style={{ alignSelf: "center" }} />
        ) : osmosisConnected && isScreenFocused ? (
          <>
            <SwapView />
            <Assets userId={selectedWallet.userId} style={styles.assets} />
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
    paddingTop: 80,
  },
  primaryButton: {
    alignSelf: "center",
  },
  assets: {
    borderTopWidth: 0,
  },
});
