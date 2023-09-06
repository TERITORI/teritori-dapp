import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SpacerRow } from "./spacer";
import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../context/DropdownsProvider";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { useMultisigContext } from "../context/MultisigReducer";
import { useWallets } from "../context/WalletsProvider";
import { useSelectedNetworkInfo } from "../hooks/useSelectedNetwork";
import {
  allNetworks,
  getNetwork,
  mustGetCosmosNetwork,
  NativeCurrencyInfo,
  NetworkKind,
} from "../networks";
import {
  setSelectedWalletId,
  setSelectedNetworkId,
  selectAreTestnetsEnabled,
  selectNetworksSettings,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { neutral17, secondaryColor } from "../utils/style/colors";
import { fontSemibold12 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { WalletProvider } from "../utils/walletProvider";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
}> = ({ style, forceNetworkId, forceNetworkKind }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();
  const { setToastError } = useFeedbacks();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const testnetsEnabled = useSelector(selectAreTestnetsEnabled);
  const networksSettings = useSelector(selectNetworksSettings);

  const { state, dispatch: multisigDispatch } = useMultisigContext();

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

    const networkInfo = mustGetCosmosNetwork(networkId);

    if (network.kind === NetworkKind.Cosmos) {
      multisigDispatch({
        type: "changeChain",
        value: {
          ...state.chain,
          nodeAddress: networkInfo.rpcEndpoint,
          denom: networkInfo.currencies[0].denom,
          displayDenom: (networkInfo.currencies[0] as NativeCurrencyInfo)
            .displayName,
          displayDenomExponent: (
            networkInfo.currencies[0] as NativeCurrencyInfo
          ).decimals,
          gasPrice: process.env.PUBLIC_GAS_PRICE,
          chainId: networkInfo.chainId,
          chainDisplayName: (networkInfo.currencies[0] as NativeCurrencyInfo)
            .displayName,
          registryName: networkInfo.displayName,
          addressPrefix: networkInfo.idPrefix,
        },
      });
    }
    closeOpenedDropdown();
  };

  const fontSize = 14;

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
          }}
          height={40}
        >
          <NetworkIcon networkId={selectedNetworkInfo?.id || ""} size={16} />
          <SpacerRow size={1} />
          <BrandText
            style={{
              color: "white",
              fontSize,
              letterSpacing: -(fontSize * 0.04),
              fontWeight: "500",
            }}
          >
            {selectedNetworkInfo?.displayName}
          </BrandText>
          <SpacerRow size={1} />
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <TertiaryBox
          width={172}
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: layout.spacing_x2,
            paddingTop: layout.spacing_x2,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {allNetworks
            .filter((network) => {
              return (
                networksSettings[network.id]?.enabled &&
                (testnetsEnabled || !network.testnet) &&
                (!forceNetworkId || network.id === forceNetworkId) && // check that it's the forced network id if forced to
                (!forceNetworkKind || network.kind === forceNetworkKind) // check that it's the correct network kind if forced to
              );
            })
            .map((network, index) => {
              const selectable =
                // !!selectableNetworks.find((sn) => sn.id === network.id) && // check that it's in the selectable list
                selectedNetworkInfo?.id !== network.id; // check that it's not already selected

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
                      style={[
                        fontSemibold12,
                        { marginLeft: layout.spacing_x1_5 },
                      ]}
                    >
                      {network?.displayName || "Unknown"}
                    </BrandText>
                  </View>
                </TouchableOpacity>
              );
            })}
        </TertiaryBox>
      )}
    </View>
  );
};
