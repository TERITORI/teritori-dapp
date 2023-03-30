import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useMultisigContext } from "../../context/MultisigReducer";
import { useWallets, Wallet } from "../../context/WalletsProvider";
import { useFetchMultisigList } from "../../hooks/multisig";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, NetworkKind } from "../../networks";
import { neutral33, neutralA3, purpleLight } from "../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../utils/style/fonts";
import { layout, topMenuWidth } from "../../utils/style/layout";
import { WalletProvider } from "../../utils/walletProvider";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { UserNameInline } from "../UserNameInline";

export const TopMenuAccount: React.FC = () => {
  const { selectedWallet, selectedMultisignWallet } = useSelectedWallet();
  const { setMultisignWallet } = useWallets();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const { state } = useMultisigContext();
  const { data: multisigList } = useFetchMultisigList(
    selectedWallet?.address || "",
    state.chain.chainId!
  );

  const [openMultisignDropList, setOpenMultisignDropList] =
    useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const getScrollViewStyle = () => {
    if (multisigList && multisigList.length > 5) {
      return [styles.dropdownMenu, { height: 200 }];
    } else {
      return styles.dropdownMenu;
    }
  };

  return (
    <FlexCol style={[styles.container, { zIndex: 20 }]}>
      <UserNameInline
        userId={
          selectedMultisignWallet
            ? selectedMultisignWallet.userId
            : selectedWallet?.userId || ""
        }
        style={styles.userImageLine}
      />

      <FlexRow alignItems="center" justifyContent="space-between">
        <TouchableOpacity
          onPress={() => {
            setOpenMultisignDropList((value) => !value);
          }}
        >
          <FlexRow alignItems="center">
            <BrandText style={styles.switchAccount}>Switch Account</BrandText>
            <SVG source={chevronRightSVG} width={16} height={16} />
            {openMultisignDropList && (
              <ScrollView style={getScrollViewStyle()}>
                <Pressable
                  onMouseEnter={() => setHoveredIndex(1)}
                  onMouseLeave={() => setHoveredIndex(0)}
                  onPress={() => {
                    setMultisignWallet(null);
                    setOpenMultisignDropList(false);
                  }}
                >
                  <BrandText
                    style={
                      hoveredIndex === 1
                        ? styles.hoveredDropdownMenuText
                        : styles.normalDropdownMenuText
                    }
                  >
                    {selectedWallet?.address}
                  </BrandText>
                </Pressable>
                {multisigList !== undefined &&
                  multisigList.map((item, index: number) => (
                    <Pressable
                      onMouseEnter={() => setHoveredIndex(index + 2)}
                      onMouseLeave={() => setHoveredIndex(0)}
                      onPress={() => {
                        setMultisignWallet({
                          id: `keplr-${item.address}`,
                          address: item.address,
                          userId: getUserId(
                            selectedNetworkInfo?.id,
                            item.address
                          ),
                          networkId: selectedNetworkInfo?.id,
                          networkKind: NetworkKind.Cosmos,
                          provider: WalletProvider.Keplr,
                          connected: true,
                        } as Wallet);
                        setOpenMultisignDropList(false);
                      }}
                      key={index}
                    >
                      <BrandText
                        style={
                          hoveredIndex === index + 2
                            ? styles.hoveredDropdownMenuText
                            : styles.normalDropdownMenuText
                        }
                      >
                        {item.address}
                      </BrandText>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
          </FlexRow>
        </TouchableOpacity>
        <OmniLink
          to={{
            screen: "UserPublicProfile",
            params: { id: selectedWallet?.userId || "" },
          }}
        >
          <BrandText style={styles.manageProfile}>Manage Profile</BrandText>
        </OmniLink>
      </FlexRow>
    </FlexCol>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.padding_x2,
  },
  userImageLine: {
    width: "100%",
    marginBottom: layout.padding_x1_5,
  },
  switchAccount: {
    ...(fontSemibold14 as object),
    marginRight: layout.padding_x0_5,
  },
  manageProfile: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },

  dropdownMenu: {
    backgroundColor: "#292929",
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: layout.padding_x1_5,
    paddingVertical: layout.padding_x2,
    paddingHorizontal: layout.padding_x1,
    position: "absolute",
    top: 20,
    width: topMenuWidth - 2 * layout.padding_x2,
    zIndex: 10,
  },
  normalDropdownMenuText: StyleSheet.flatten([
    fontMedium13,
    {
      color: neutralA3,
      padding: layout.padding_x1,
    },
  ]),
  hoveredDropdownMenuText: StyleSheet.flatten([
    fontMedium13,
    {
      backgroundColor: neutral33,
      borderRadius: 6,
      padding: layout.padding_x1,
    },
  ]),
});
