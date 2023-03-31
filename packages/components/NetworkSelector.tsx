import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../context/DropdownsProvider";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { useWallets } from "../context/WalletsProvider";
import { useSelectedNetworkInfo } from "../hooks/useSelectedNetwork";
import {
  getNetwork,
  NetworkInfo,
  NetworkKind,
  selectableNetworks,
} from "../networks";
import {
  setSelectedWalletId,
  setSelectedNetworkId,
  selectAreTestnetsEnabled,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { neutral17, secondaryColor } from "../utils/style/colors";
import { fontSemibold12 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SpacerRow } from "./spacer";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  hideDropdown?: string;
  iconHide?: string;
}> = ({ style, forceNetworkId, forceNetworkKind, hideDropdown, iconHide }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();
  const { setToastError } = useFeedbacks();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const testnetsEnabled = useSelector(selectAreTestnetsEnabled);

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
          {iconHide ? (
            ""
          ) : (
            <>
              <NetworkIcon
                networkId={selectedNetworkInfo?.id || ""}
                size={16}
              />
            </>
          )}

          <SpacerRow size={1} />
          <BrandText
            style={{
              color: "white",
              fontSize,
              letterSpacing: -(fontSize * 0.04),
              fontWeight: "500",
            }}
          >
            {hideDropdown ? "" : <> {selectedNetworkInfo?.displayName}</>}
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
            paddingHorizontal: layout.padding_x2,
            paddingTop: layout.padding_x2,
            backgroundColor: neutral17,
            alignItems: "flex-start",
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
                (!forceNetworkId || network.id === forceNetworkId) && // check that it's the forced network id if forced to
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
                    {console.log(network.id, "hello network")}
                    {iconHide ? (
                      ""
                    ) : (
                      <>
                        <NetworkIcon networkId={network.id} size={16} />
                      </>
                    )}

                    <BrandText
                      style={[
                        fontSemibold12,
                        { marginLeft: layout.padding_x1_5 },
                      ]}
                    >
                      {hideDropdown ? (
                        ""
                      ) : (
                        <>{network?.displayName || "Unknown"}</>
                      )}
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
