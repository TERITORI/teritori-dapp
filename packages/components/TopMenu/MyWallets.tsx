import {StyleSheet, TouchableOpacity, View} from "react-native";
import {layout} from "../../utils/style/layout";
import {
  gradientColorBlue,
  gradientColorDarkerBlue, gradientColorTurquoise, neutral17,
  neutralA3,
  purpleDark,
} from "../../utils/style/colors";
import {fontBold12, fontSemibold12, fontSemibold14} from "../../utils/style/fonts";
import {BrandText} from "../BrandText";
import {SVG} from "../SVG";
import FlexRow from "../containers/FlexRow";
import FlexCol from "../containers/FlexCol";
import {LinearGradient} from "expo-linear-gradient";
import {SecondaryButton} from "../buttons/SecondaryButton";
import React, {useMemo, useState} from "react";
import walletsSVG from "../../../assets/icons/wallets.svg"
import {TopMenuSection} from "./TopMenuSection";
import {DepositWithdrawModal} from "../../screens/WalletManager/components/DepositWithdrawModal";
import {useSelectedNetworkId} from "../../hooks/useSelectedNetwork";
import {getNetwork, NativeCurrencyInfo} from "../../networks";
import {useAppNavigation} from "../../utils/navigation";
import {SendModal} from "../modals/SendModal";

const TokenBalance: React.FC = () => {
  return (
    <FlexCol>
      <FlexRow alignItems="center" justifyContent="space-between">
        <BrandText style={[fontSemibold12, {color: neutralA3}]}>Total balance</BrandText>
        <BrandText style={fontBold12}>$500</BrandText>
      </FlexRow>

      <FlexRow alignItems="center" style={{marginBottom: layout.padding_x1_5, marginTop: layout.padding_x1}}>
        <LinearGradient
          colors={[gradientColorDarkerBlue, gradientColorBlue, gradientColorTurquoise]}
          style={{borderRadius: 4, flex: 5, height: 4}}
          start={{x:0, y:.5}}
          end={{x:1, y:.5}}
        />
        <View style={{backgroundColor: purpleDark, borderRadius: 4, marginLeft: 1, flex: 1, height: 4}}/>
      </FlexRow>

      <FlexCol style={{backgroundColor: neutral17, padding: layout.padding_x1, borderRadius: 8}}>
        <FlexRow justifyContent="space-between" style={{marginBottom: layout.padding_x1}}>
          <FlexRow alignItems="center" width={"auto"}>
              <LinearGradient
                style={{marginRight: layout.padding_x1, width: 16, height: 16, borderRadius: 999}}
                colors={[gradientColorDarkerBlue, gradientColorBlue, gradientColorTurquoise]}
                start={{x:0, y:.5}}
                end={{x:1, y:.5}}
              />
            <BrandText style={fontSemibold12}>Available</BrandText>
          </FlexRow>
          <BrandText style={fontBold12}>$400</BrandText>
        </FlexRow>

        <FlexRow justifyContent="space-between">
          <FlexRow alignItems="center" width={"auto"}>
            <View style={{marginRight: layout.padding_x1, width: 16, height: 16, backgroundColor: purpleDark, borderRadius: 999}}/>
            <BrandText style={fontSemibold12}>Staked</BrandText>
          </FlexRow>
          <BrandText style={fontBold12}>$100</BrandText>
        </FlexRow>
      </FlexCol>
    </FlexCol>
  )
}

export const MyWallets: React.FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const [isDepositVisible, setDepositVisible] = useState(false)
  const [isSwapVisible, setSwapVisible] = useState(false)
  const [isSendVisible, setSendVisible] = useState(false)

  const atomIbcCurrency = useMemo(() => {
    const network = getNetwork(selectedNetworkId)
    return network?.currencies.find(currencyInfo => currencyInfo.kind === "ibc" && currencyInfo.sourceDenom === "uatom")
  }, [selectedNetworkId])

  const selectedNetworkNativeCurrency = useMemo(() => {
    const network = getNetwork(selectedNetworkId)
    return network?.currencies.find(currencyInfo => currencyInfo.kind === "native") as NativeCurrencyInfo
  }, [selectedNetworkId])

  return (
    <>
    <TopMenuSection title="My Wallets">
      <TokenBalance/>

      <FlexRow alignItems="center" justifyContent="space-between" style={styles.buttonsContainer}>
        <SecondaryButton
          paddingHorizontal={layout.padding_x2}
          text="Deposit"
          size="XS"
          onPress={() => setDepositVisible(true)}
        />
        <SecondaryButton
          paddingHorizontal={layout.padding_x2}
          text="Stake"
          size="XS"
          onPress={() => navigation.navigate("Staking")}
        />
        <SecondaryButton
          paddingHorizontal={layout.padding_x2}
          text="Send"
          size="XS"
          onPress={() => setSendVisible(true)}
        />
        <SecondaryButton
          paddingHorizontal={layout.padding_x2}
          text="Swap"
          size="XS"
          disabled
          onPress={() => setSwapVisible(true)}
        />
      </FlexRow>

      <FlexRow justifyContent="center">
        <TouchableOpacity style={styles.manageWalletsContainer} onPress={() => navigation.navigate("WalletManagerWallets")}>
          <BrandText style={styles.manageWallets}>Manage wallets</BrandText>
          <SVG source={walletsSVG} width={24} height={24}/>
        </TouchableOpacity>
      </FlexRow>
    </TopMenuSection>

    <DepositWithdrawModal
      variation="deposit"
      networkId={selectedNetworkId}
      targetCurrency={atomIbcCurrency?.denom}
      onClose={() => setDepositVisible(false)}
      isVisible={isDepositVisible}
    />
    <SendModal
      networkId={selectedNetworkId}
      nativeCurrency={selectedNetworkNativeCurrency}
      onClose={() => setSendVisible(false)}
      isVisible={isSendVisible}
    />
  </>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    marginVertical: layout.padding_x1_5
  },
  manageWalletsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  manageWallets: {
    ...(fontSemibold14 as object),
    marginRight: layout.padding_x1
  }
});
