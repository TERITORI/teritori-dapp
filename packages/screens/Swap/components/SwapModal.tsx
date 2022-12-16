import { Decimal } from "cosmwasm";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

import chevronCircleDown from "../../../../assets/icons/chevron-circle-down.svg";
import chevronCircleUp from "../../../../assets/icons/chevron-circle-up.svg";
import osmosisLogo from "../../../../assets/icons/networks/osmosis.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import { useCoingeckoPrices } from "../../../hooks/useCoingeckoPrices";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useSwap } from "../../../hooks/useSwap";
import {
  CurrencyInfo,
  getNativeCurrency,
  getNetwork,
  NativeCurrencyInfo,
} from "../../../networks";
import { NetworkName } from "../../../networks/NetworkName";
import { selectSelectedNetworkId } from "../../../store/slices/settings";
import { Balance } from "../../../utils/coins";
import {
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CurrencySelector } from "./CurrencySelector";

type SwapModalProps = {
  onClose: () => void;
  visible: boolean;
};

//TODO: Amounts not refreshed (Assets, etc..)
//TODO: Lost 10 OSMO ===> Need to fix swap params (+ Fee, slippage.. ?)
//TODO:  fix errors useSwap

// Where to use that ?
const SWAP_FEE_MULTIPLIER = 0.998; // Fee 0.2 %

export const ModalHeader: React.FC = () => {
  return (
    <View style={styles.modalHeaderContainer}>
      <SVG source={osmosisLogo} height={32} width={32} />
      <BrandText style={styles.modalHeaderTitle}>Swap on OSMOSIS</BrandText>
    </View>
  );
};

export const SwapModal: React.FC<SwapModalProps> = ({ onClose, visible }) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  const balances = useBalances(selectedNetworkId, selectedWallet?.address);

  // ---- Default currencies
  const atomCurrency = useMemo(
    () =>
      selectedNetwork?.currencies.find(
        (currencyInfo) =>
          currencyInfo.sourceNetworkDisplayName === NetworkName.CosmosHub
      ),
    [selectedNetwork?.currencies]
  );
  const osmoCurrency = useMemo(
    () =>
      selectedNetwork?.currencies.find(
        (currencyInfo) =>
          currencyInfo.sourceNetworkDisplayName === NetworkName.Osmosis
      ),
    [selectedNetwork?.currencies]
  );

  useEffect(() => {
    setCurrencyIn(atomCurrency);
    setCurrencyOut(osmoCurrency);
  }, [atomCurrency, osmoCurrency]);

  // ---- The two current currencies
  const [currencyIn, setCurrencyIn] = useState<CurrencyInfo | undefined>(
    atomCurrency
  );
  const [currencyOut, setCurrencyOut] = useState<CurrencyInfo | undefined>(
    osmoCurrency
  );
  const currencyInNative: NativeCurrencyInfo | undefined = useMemo(
    () => getNativeCurrency(selectedNetworkId, currencyIn?.denom),
    [currencyIn?.denom]
  );
  const currencyOutNative: NativeCurrencyInfo | undefined = useMemo(
    () => getNativeCurrency(selectedNetworkId, currencyOut?.denom),
    [currencyOut?.denom]
  );

  // ---- Displayed and selectable currencies
  const selectableCurrenciesIn = useMemo(
    () =>
      selectedNetwork?.currencies.filter(
        (currencyInfo) =>
          ((currencyInfo.kind === "ibc" && !currencyInfo.deprecated) ||
            currencyInfo.kind === "native") &&
          currencyIn?.sourceNetworkDisplayName !==
            currencyInfo.sourceNetworkDisplayName &&
          currencyInfo.sourceNetworkDisplayName !==
            currencyOut?.sourceNetworkDisplayName
      ),
    [
      currencyOut?.sourceNetworkDisplayName,
      currencyIn?.sourceNetworkDisplayName,
    ]
  );
  const selectableCurrenciesOut = useMemo(
    () =>
      selectedNetwork?.currencies.filter(
        (currencyInfo) =>
          ((currencyInfo.kind === "ibc" && !currencyInfo.deprecated) ||
            currencyInfo.kind === "native") &&
          currencyOut?.sourceNetworkDisplayName !==
            currencyInfo.sourceNetworkDisplayName &&
          currencyInfo.sourceNetworkDisplayName !==
            currencyIn?.sourceNetworkDisplayName
      ),
    [
      currencyIn?.sourceNetworkDisplayName,
      currencyOut?.sourceNetworkDisplayName,
    ]
  );

  // ---- The user's amount of the first currency
  const currencyInBalance: Balance | undefined = useMemo(
    () => balances.find((bal) => bal.denom === currencyIn?.denom),
    [currencyIn?.denom, balances]
  );
  const currencyInAmount: string = useMemo(() => {
    if (!currencyInNative || !currencyInBalance) return "0";
    return Decimal.fromAtomics(
      currencyInBalance.amount,
      currencyInNative.decimals
    ).toString();
  }, [
    currencyIn?.denom,
    currencyInBalance?.amount,
    currencyInNative?.decimals,
  ]);

  // ---- Current amounts (The user enters amountIn)
  const [amountIn, setAmountIn] = useState(0);

  const prices = useCoingeckoPrices([
    { networkId: selectedNetworkId, denom: currencyIn?.denom },
    { networkId: selectedNetworkId, denom: currencyOut?.denom },
  ]);
  // ---- USD price for the first currency
  const amountInUsd: number = useMemo(() => {
    if (!currencyInNative || !amountIn || !prices[currencyInNative.coingeckoId])
      return 0;
    return amountIn * prices[currencyInNative.coingeckoId].usd;
  }, [currencyInNative?.coingeckoId, amountIn, prices]);

  // ---- Amount of the second currency depending on the first one's amount TODO: -Fee 0.2% ???
  const amountOut: number = useMemo(() => {
    if (!currencyOutNative || !prices[currencyOutNative.coingeckoId]) return 0;
    return (
      (amountInUsd * SWAP_FEE_MULTIPLIER) /
      prices[currencyOutNative.coingeckoId].usd
    );
  }, [amountInUsd, currencyOutNative?.coingeckoId, prices]);

  // ---- USD price for the second currency
  const amountOutUsd: number = useMemo(() => {
    if (
      !currencyOutNative ||
      !amountOut ||
      !prices[currencyOutNative.coingeckoId]
    )
      return 0;
    return amountOut * prices[currencyOutNative.coingeckoId].usd;
  }, [currencyOutNative?.coingeckoId, amountOut, prices]);

  // ---- Invert button
  const onPressInvert = () => {
    setCurrencyIn(currencyOut);
    setCurrencyOut(currencyIn);
    setAmountIn(amountOut);
  };
  const onPressHalf = () => {
    setAmountIn(parseFloat(currencyInAmount) / 2);
  };
  const onPressMax = () => {
    setAmountIn(parseFloat(currencyInAmount));
  };

  // ---- SWAP OSMOSIS
  const { swap } = useSwap({
    amountIn,
    amountOut,
    currencyIn,
    currencyOut,
    callback: onClose,
  });

  // ===== RETURN
  return (
    <ModalBase
      Header={ModalHeader}
      width={456}
      visible={visible}
      onClose={onClose}
    >
      <View style={styles.modalChildren}>
        {/*======= First currency */}
        <TertiaryBox
          fullWidth
          mainContainerStyle={styles.tertiaryBoxMainContainer}
          style={{ zIndex: 15 }}
        >
          <View style={styles.counts}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Available{" "}
              <BrandText style={{ color: primaryColor }}>
                {currencyInAmount}
              </BrandText>
            </BrandText>
            <View style={{ flexDirection: "row" }}>
              <SecondaryButton size="XS" text="MAX" onPress={onPressMax} />
              <SecondaryButton
                onPress={onPressHalf}
                size="XS"
                text="HALF"
                touchableStyle={{ marginLeft: layout.padding_x1 }}
              />
            </View>
          </View>

          <View style={styles.currency}>
            <CurrencySelector
              selectedCurrency={currencyIn}
              currencies={selectableCurrenciesIn || []}
              onChangeCurrency={(currency) => setCurrencyIn(currency)}
            />

            <View>
              {/*<TextInputCustom<SwapFormType>*/}
              {/*  name="amountIn"*/}
              {/*  textInputStyle={[styles.amount, fontSemibold20]}*/}
              {/*  labelStyle={{ display: "none" }}*/}
              {/*  label=""*/}
              {/*  placeHolder="0"*/}
              {/*  value={amountIn ? parseFloat(amountIn.toFixed(5)).toString() : ""}*/}
              {/*  onChangeText={(text) => setAmountIn(parseFloat(text))}*/}
              {/*  variant="noStyle"*/}
              {/*/>*/}
              <TextInput
                style={[styles.inputAmount, fontSemibold20]}
                value={
                  amountIn ? parseFloat(amountIn.toFixed(6)).toString() : "0"
                }
                onChangeText={(text) => setAmountIn(parseFloat(text))}
              />

              <BrandText style={[styles.amountUsd, fontSemibold14]}>
                ≈ ${parseFloat(amountInUsd.toFixed(2).toString())}
              </BrandText>
            </View>
          </View>
        </TertiaryBox>

        <SpacerColumn size={1.5} />

        {/*======= Second currency */}
        <TertiaryBox
          fullWidth
          mainContainerStyle={styles.tertiaryBoxMainContainer}
          style={{ zIndex: 10 }}
        >
          <View style={styles.currency}>
            <CurrencySelector
              selectedCurrency={currencyOut}
              currencies={selectableCurrenciesOut || []}
              onChangeCurrency={(currency) => setCurrencyOut(currency)}
            />
            <View>
              <BrandText
                style={[
                  styles.amount,
                  fontSemibold20,
                  !amountOut && { color: neutralA3 },
                ]}
              >
                ≈{" "}
                {!amountOut ? "0" : parseFloat(amountOut.toFixed(6)).toString()}
              </BrandText>
              <BrandText style={[styles.amountUsd, fontSemibold14]}>
                ≈ ${parseFloat(amountOutUsd.toFixed(2).toString())}
              </BrandText>
            </View>
          </View>
        </TertiaryBox>

        {/*======= Invert button */}
        <CustomPressable onPress={onPressInvert} style={styles.invertButton}>
          {({ hovered }) => (
            <SVG
              source={hovered ? chevronCircleDown : chevronCircleUp}
              height={32}
              width={32}
            />
          )}
        </CustomPressable>

        <SpacerColumn size={2.5} />

        <PrimaryButton
          size="XL"
          loader
          text={
            amountIn && amountIn > parseFloat(currencyInAmount)
              ? "Insufficient balance"
              : "Swap"
          }
          fullWidth
          disabled={!amountIn || amountIn > parseFloat(currencyInAmount)}
          onPress={swap}
        />
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  tertiaryBoxMainContainer: {
    padding: layout.padding_x2,
  },
  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalHeaderTitle: {
    marginLeft: layout.padding_x2,
  },
  modalChildren: {
    alignItems: "center",
    paddingBottom: layout.padding_x2_5,
  },
  text: {
    color: neutral77,
    maxWidth: 371,
    marginBottom: layout.padding_x2_5,
    marginTop: layout.padding_x4,
  },
  counts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: layout.padding_x2,
  },
  currency: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  invertButton: {
    position: "absolute",
    zIndex: 20,
    top: 124,
  },
  amountUsd: {
    color: neutralA3,
    textAlign: "right",
  },
  inputAmount: {
    outlineStyle: "none",
    color: secondaryColor,
    maxWidth: 200,
    textAlign: "right",
  },
  amount: {
    textAlign: "right",
  },
});
