import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";

import {BrandText} from "../../components/BrandText";
import {ScreenContainer} from "../../components/ScreenContainer";
import {PrimaryButton} from "../../components/buttons/PrimaryButton";
import {useBalances} from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {selectSelectedNetworkId, setSelectedNetworkId} from "../../store/slices/settings";
import {ScreenFC} from "../../utils/navigation";
import {Assets} from "../WalletManager/Assets";
import {ConnectModal} from "./components/ConnectModal";
import {SwapModal} from "./components/SwapModal";
import {allNetworks, getNetwork, isTeritoriTestnet} from "../../networks";
import {NetworkName} from "../../networks/NetworkName";
import {useAppDispatch} from "../../store/store";

export const SwapScreen: ScreenFC<"Swap"> = () => {
  const selectedWallet = useSelectedWallet();

  //TODO: create Osmosis Network and allow to connect to it
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const dispatch = useAppDispatch();

  const [swapModalVisible, setSwapModalVisible] = useState(false);
  // TODO: display ConnectModal if not connected to Osmosis Network
  const [connectModalVisible, setConnectModalVisible] = useState(false);

  const selectedNetwork = getNetwork(selectedNetworkId)
  if (!selectedNetwork) {
    return null;
  }

  const balances = useBalances(selectedNetworkId, selectedWallet?.address);

  const osmosisConnected =  selectedNetwork?.displayName === (isTeritoriTestnet() ? NetworkName.OsmosisTestnet : NetworkName.Osmosis)

  ///// OSMOSIS ////////
  // const RPC_ENDPOINT = "https://rpc-osmosis.keplr.app"
  const RPC_ENDPOINT = process.env.PUBLIC_CHAIN_RPC_ENDPOINT || "";

  const onPressConnect = () => {
    const osmosisNetworkId = allNetworks.find(networkInfo => networkInfo.displayName === (isTeritoriTestnet() ? NetworkName.OsmosisTestnet : NetworkName.Osmosis))?.id || ""
    dispatch(setSelectedNetworkId(osmosisNetworkId))
    setConnectModalVisible(false)
  }

  useEffect(() => {
    if (osmosisConnected) setConnectModalVisible(false);
    else setConnectModalVisible(true);
  }, [osmosisConnected]);


  // useEffect(() => {
  //   const effect = async () => {
  //     const { createRPCQueryClient } = osmosis.ClientFactory;
  //     const client = await createRPCQueryClient({ rpcEndpoint: RPC_ENDPOINT });
  //
  //     console.log("clientclientclient", client);
  //
  //     // now you can query the cosmos modules
  //     const balance = await client.cosmos.bank.v1beta1.allBalances({
  //       address: selectedWallet?.address || "",
  //     });
  //
  //     console.log("balancebalancebalancebalance", balance);
  //
  //     // // you can also query the osmosis pools
  //     //       const response = await client.osmosis.gamm.v1beta1.pools();
  //     //
  //     // // currently Pools need to be decoded
  //     //       response.pools.map(({ typeUrl, value }) => {
  //     //         console.log(osmosis.gamm.v1beta1.Pool.decode(value));
  //     //       })
  //   };
  //   effect();
  // });
  // //////////////////////

  return (
    <ScreenContainer headerChildren={<BrandText>Swap</BrandText>}>
      <View style={styles.mainContainer}>
        {osmosisConnected ? (
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
        selectedNetwork={selectedNetwork}
        visible={swapModalVisible}
        onClose={() => setSwapModalVisible(false)}
        balances={balances}
      />
      <ConnectModal
        onPress={onPressConnect}
        visible={connectModalVisible}
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
