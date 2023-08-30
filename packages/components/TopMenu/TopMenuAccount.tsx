import React, { FC, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { JoinState } from "../../api/multisig/v1/multisig";
import { useWallets, Wallet } from "../../context/WalletsProvider";
import { useUserMultisigs } from "../../hooks/multisig";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork, getUserId, NetworkKind } from "../../networks";
import {
  neutral00,
  neutral22,
  neutralA3,
  purpleLight,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { WalletProvider } from "../../utils/walletProvider";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { UserNameInline } from "../UserNameInline";
import { CustomPressable } from "../buttons/CustomPressable";
import { RoundedGradientImage } from "../images/RoundedGradientImage";

const TINY_ADDRESSES_COUNT = 40;

export const TopMenuAccount: React.FC = () => {
  const { selectedWallet, selectedMultisignWallet } = useSelectedWallet();
  const { setMultisignWallet, wallets } = useWallets();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const { multisigs: multisigList } = useUserMultisigs(
    selectedWallet?.userId,
    JoinState.JOIN_STATE_IN
  );

  const [isAccountsListShown, setAccountsListShown] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <FlexCol>
      <UserNameInline
        userId={
          selectedMultisignWallet
            ? selectedMultisignWallet.userId
            : selectedWallet?.userId || ""
        }
        style={styles.userImageLine}
      />

      <FlexRow
        alignItems="center"
        justifyContent="space-between"
        style={[
          { paddingHorizontal: layout.padding_x2 },
          !isAccountsListShown && { marginBottom: layout.padding_x1_5 },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setAccountsListShown((value) => !value);
          }}
        >
          <FlexRow alignItems="center">
            <BrandText style={styles.switchAccount}>Switch Account</BrandText>
            <SVG
              source={isAccountsListShown ? chevronDownSVG : chevronRightSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
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

      {isAccountsListShown && (
        <ScrollView style={styles.accountsListContainer}>
          <View style={styles.menuSectionTitleContainer}>
            <BrandText style={styles.menuSectionTitle}>User wallets</BrandText>
          </View>

          {/*===== Single wallets */}
          {wallets.map((item, index) => (
            <CustomPressable
              key={index}
              disabled={item.address === selectedWallet?.address}
              onHoverIn={() => setHoveredIndex(1)}
              onHoverOut={() => setHoveredIndex(0)}
              onPress={() => {
                setMultisignWallet(null);
                setAccountsListShown(false);
              }}
              style={[
                (hoveredIndex === 1 ||
                  item.address === selectedWallet?.address) && { opacity: 0.5 },
                styles.walletLine,
              ]}
            >
              <WalletRow
                address={item?.address || ""}
                userId={item?.userId || ""}
              />
            </CustomPressable>
          ))}

          {/*===== Multisig wallets */}
          {!!multisigList?.length && (
            <>
              <View style={styles.menuSectionTitleContainer}>
                <BrandText style={styles.menuSectionTitle}>
                  Multisig wallets
                </BrandText>
              </View>

              {multisigList.map((item, index: number) => (
                <CustomPressable
                  key={index}
                  disabled={item.address === selectedMultisignWallet?.address}
                  onHoverIn={() => setHoveredIndex(index + 2)}
                  onHoverOut={() => setHoveredIndex(0)}
                  onPress={() => {
                    setMultisignWallet({
                      id: `keplr-${item.address}`,
                      address: item.address,
                      userId: getUserId(selectedNetworkInfo?.id, item.address),
                      networkId: selectedNetworkInfo?.id,
                      networkKind: NetworkKind.Cosmos,
                      provider: WalletProvider.Keplr,
                      connected: true,
                    } as Wallet);
                    setAccountsListShown(false);
                  }}
                  style={[
                    (hoveredIndex === index + 2 ||
                      item.address === selectedMultisignWallet?.address) && {
                      opacity: 0.5,
                    },
                    styles.walletLine,
                  ]}
                >
                  <WalletRow
                    address={item.address}
                    userId={getUserId(selectedNetworkInfo?.id, item.address)}
                  />
                </CustomPressable>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </FlexCol>
  );
};

const WalletRow: FC<{ address: string; userId: string }> = ({
                                                                address,
                                                                userId,
                                                            }) => {
    const selectedNetworkId = useSelectedNetworkId();
    const network = getCosmosNetwork(selectedNetworkId);
    const userInfo = useNSUserInfo(userId);
    const userName =
        userInfo?.metadata?.tokenId ||
        tinyAddress(address, TINY_ADDRESSES_COUNT) ||
        "";
    return (
        <>
            <RoundedGradientImage
                size="XXS"
                sourceURI={userInfo?.metadata?.image}
                fallbackURI={network?.nameServiceDefaultImage}
            />
            <BrandText
                style={styles.itemText}
                ellipsizeMode="middle"
                numberOfLines={1}
            >
                {userName}
            </BrandText>
        </>
    );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  userImageLine: {
    width: "100%",
    marginBottom: layout.padding_x1_5,
    marginTop: layout.padding_x2,
    paddingHorizontal: layout.padding_x2,
  },
  switchAccount: {
    ...(fontSemibold14 as object),
    marginRight: layout.padding_x0_5,
  },
  manageProfile: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },

  accountsListContainer: {
    backgroundColor: neutral00,
    width: "100%",
    marginVertical: layout.padding_x0_75,
  },
  itemText: StyleSheet.flatten([
    fontSemibold12,
    {
      marginLeft: layout.padding_x1_5,
    },
  ]),
  menuSectionTitleContainer: {
    backgroundColor: neutral22,
    paddingVertical: layout.padding_x0_5,
    marginVertical: layout.padding_x0_75,
  },
  menuSectionTitle: StyleSheet.flatten([
    fontSemibold12,
    {
      color: neutralA3,
      marginLeft: layout.padding_x2,
    },
  ]),
  walletLine: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.padding_x1_5,
    paddingVertical: layout.padding_x0_75,
  },
});
