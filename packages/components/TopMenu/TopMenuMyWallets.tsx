import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { TopMenuSection } from "./TopMenuSection";
import walletsSVG from "../../../assets/icons/wallets.svg";
import { useBalances } from "../../hooks/useBalances";
import { useDelegations } from "../../hooks/useDelegations";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  CurrencyInfo,
  getStakingCurrency,
  NetworkKind,
  UserKind,
} from "../../networks";
import { DepositWithdrawModal } from "../../screens/WalletManager/components/DepositWithdrawModal";
import { useAppNavigation } from "../../utils/navigation";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral17,
  neutral77,
  neutralA3,
  purpleDark,
} from "../../utils/style/colors";
import {
  fontBold12,
  fontSemibold12,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { SVG } from "../SVG";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SendModal } from "../modals/SendModal";

const TokenBalance: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const { delegationsBalances } = useDelegations(
    selectedNetworkId,
    selectedWallet?.address,
  );
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const GAUGE_WIDTH = 300;

  const availableUSDBalance = useMemo(
    () => balances.reduce((total, bal) => total + (bal.usdAmount || 0), 0),
    [balances],
  );
  const delegationsUsdBalance = useMemo(
    () =>
      delegationsBalances.reduce(
        (total, bal) => total + (bal.usdAmount || 0),
        0,
      ),
    [delegationsBalances],
  );

  const gaugeStakedWidth = useMemo(
    () =>
      (GAUGE_WIDTH * delegationsUsdBalance) /
      (delegationsUsdBalance + availableUSDBalance),
    [delegationsUsdBalance, availableUSDBalance],
  );

  return (
    <FlexCol>
      <FlexRow alignItems="center" justifyContent="space-between">
        <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
          Total balance
        </BrandText>
        <BrandText style={fontBold12}>{`$${(
          availableUSDBalance + delegationsUsdBalance
        ).toFixed(2)}`}</BrandText>
      </FlexRow>

      <FlexRow
        alignItems="center"
        style={{
          marginBottom: layout.spacing_x1_5,
          marginTop: layout.spacing_x1,
        }}
      >
        {!availableUSDBalance ? (
          <View
            style={{
              backgroundColor: neutral77,
              borderRadius: 4,
              flex: 1,
              height: 4,
            }}
          />
        ) : (
          <>
            <LinearGradient
              colors={[
                gradientColorDarkerBlue,
                gradientColorBlue,
                gradientColorTurquoise,
              ]}
              style={{
                borderRadius: 4,
                width: GAUGE_WIDTH - gaugeStakedWidth,
                height: 4,
              }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />

            {!!gaugeStakedWidth && (
              <View
                style={{
                  backgroundColor: purpleDark,
                  borderRadius: 4,
                  marginLeft: 1,
                  width: gaugeStakedWidth,
                  height: 4,
                }}
              />
            )}
          </>
        )}
      </FlexRow>

      <FlexCol
        style={{
          backgroundColor: neutral17,
          padding: layout.spacing_x1,
          borderRadius: 8,
        }}
      >
        <FlexRow
          justifyContent="space-between"
          style={{ marginBottom: layout.spacing_x1 }}
        >
          <FlexRow alignItems="center" width="auto">
            <LinearGradient
              style={{
                marginRight: layout.spacing_x1,
                width: 16,
                height: 16,
                borderRadius: 999,
              }}
              colors={[
                gradientColorDarkerBlue,
                gradientColorBlue,
                gradientColorTurquoise,
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
            <BrandText style={fontSemibold12}>Available</BrandText>
          </FlexRow>
          <BrandText style={fontBold12}>{`$${availableUSDBalance.toFixed(
            2,
          )}`}</BrandText>
        </FlexRow>

        <FlexRow justifyContent="space-between">
          <FlexRow alignItems="center" width="auto">
            <View
              style={{
                marginRight: layout.spacing_x1,
                width: 16,
                height: 16,
                backgroundColor: purpleDark,
                borderRadius: 999,
              }}
            />
            <BrandText style={fontSemibold12}>Staked</BrandText>
          </FlexRow>
          <BrandText style={fontBold12}>{`$${delegationsUsdBalance.toFixed(
            2,
          )}`}</BrandText>
        </FlexRow>
      </FlexCol>
    </FlexCol>
  );
};

export const TopMenuMyWallets: React.FC = () => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const navigation = useAppNavigation();
  const [isDepositVisible, setDepositVisible] = useState(false);
  const [isSendVisible, setSendVisible] = useState(false);

  const atomIbcCurrency = useMemo(() => {
    return selectedNetworkInfo?.currencies.find(
      (currencyInfo: CurrencyInfo) =>
        currencyInfo.kind === "ibc" && currencyInfo.sourceDenom === "uatom",
    );
  }, [selectedNetworkInfo]);

  return (
    <>
      <TopMenuSection title="My Wallets">
        <TokenBalance />

        <FlexRow
          alignItems="center"
          justifyContent="space-between"
          style={styles.buttonsContainer}
        >
          <SecondaryButton
            disabled={selectedNetworkInfo?.kind !== NetworkKind.Cosmos}
            paddingHorizontal={layout.spacing_x2}
            text="Deposit"
            size="XS"
            onPress={() => setDepositVisible(true)}
          />
          <SecondaryButton
            disabled={selectedNetworkInfo?.kind !== NetworkKind.Cosmos}
            paddingHorizontal={layout.spacing_x2}
            text="Stake"
            size="XS"
            onPress={() => navigation.navigate("Staking")}
          />
          <SecondaryButton
            disabled={
              ![NetworkKind.Cosmos, NetworkKind.Gno].includes(
                selectedNetworkInfo?.kind || NetworkKind.Unknown,
              )
            }
            paddingHorizontal={layout.spacing_x2}
            text="Send"
            size="XS"
            onPress={() => setSendVisible(true)}
          />
          {/*TODO: Handle this when the Swap feature is available*/}
          <SecondaryButton
            paddingHorizontal={layout.spacing_x2}
            text="Swap"
            size="XS"
            onPress={() => navigation.navigate("Swap")}
          />
        </FlexRow>

        <FlexRow justifyContent="center">
          <TouchableOpacity
            style={styles.manageWalletsContainer}
            onPress={() => navigation.navigate("WalletManagerWallets")}
          >
            <BrandText style={styles.manageWallets}>Manage wallets</BrandText>
            <SVG source={walletsSVG} width={24} height={24} />
          </TouchableOpacity>
        </FlexRow>
      </TopMenuSection>

      {!!selectedNetworkInfo && (
        <>
          <DepositWithdrawModal
            variation="deposit"
            networkId={selectedNetworkInfo.id}
            targetCurrency={atomIbcCurrency?.denom}
            onClose={() => setDepositVisible(false)}
            isVisible={isDepositVisible}
          />
          <SendModal
            userKind={UserKind.Single}
            nativeCurrency={getStakingCurrency(selectedNetworkInfo.id)}
            onClose={() => setSendVisible(false)}
            isVisible={isSendVisible}
          />
        </>
      )}
    </>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  buttonsContainer: {
    marginVertical: layout.spacing_x1_5,
  },
  manageWalletsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  manageWallets: {
    ...(fontSemibold14 as object),
    marginRight: layout.spacing_x1,
  },
});
