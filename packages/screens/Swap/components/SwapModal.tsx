import { Decimal } from "cosmwasm";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useSwap } from "../../../hooks/useSwap";
import { CurrencyInfo, getNativeCurrency, getNetwork } from "../../../networks";
import { NetworkName } from "../../../networks/NetworkName";
import { selectSelectedNetworkId } from "../../../store/slices/settings";
import {
  neutral77,
  neutralA3,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SwapFormType } from "../types";
import { CurrencySelector } from "./CurrencySelector";

type SwapModalProps = {
  onClose: () => void;
  visible: boolean;
};

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
  // if(!selectedNetworkId || !selectedNetwork || !selectedWallet?.address) return null

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
  const [currencyIn, setCurrencyIn] = useState<CurrencyInfo | undefined>(
    atomCurrency
  );
  const [currencyOut, setCurrencyOut] = useState<CurrencyInfo | undefined>(
    osmoCurrency
  );

  const [amountIn, setAmountIn] = useState<string>();
  const [amountOut, setAmountOut] = useState("0");

  const aa = useSwap("0.2452", "0.113", currencyIn, currencyOut);

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

  const currencyInBalance = useMemo(
    () => balances.find((bal) => bal.denom === currencyIn?.denom),
    [currencyIn?.denom, balances]
  );

  const currencyOutBalance = useMemo(
    () => balances.find((bal) => bal.denom === currencyOut?.denom),
    [currencyOut?.denom, balances]
  );

  const currencyInAmount = useMemo(
    () =>
      Decimal.fromAtomics(
        currencyInBalance?.amount || "0",
        getNativeCurrency(selectedNetworkId, currencyIn?.denom)?.decimals || 0
      ).toString(),
    [currencyIn?.denom, currencyInBalance?.amount]
  );

  //TODO: onChange amountIn : Get swap result

  useEffect(() => {}, [amountIn]);

  const onPressInvert = () => {
    setCurrencyIn(currencyOut);
    setCurrencyOut(currencyIn);
    // TODO: Recalculate amounts
    setAmountIn(amountOut);
    setAmountOut(amountIn || "0");
  };
  const onPressHalf = () => {};
  const onPressMax = () => {};

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
              <TextInputCustom<SwapFormType>
                name="amountIn"
                textInputStyle={[styles.amount, fontSemibold20]}
                labelStyle={{ display: "none" }}
                label=""
                placeHolder="0"
                value={amountIn}
                onChangeText={setAmountIn}
                variant="noStyle"
              />

              <BrandText style={[styles.amountUsd, fontSemibold14]}>
                ≈ ${currencyInBalance?.usdAmount?.toFixed(2) || "0"}
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
                  amountOut === "0" && { color: neutralA3 },
                ]}
              >
                ≈ {amountOut}
              </BrandText>
              <BrandText style={[styles.amountUsd, fontSemibold14]}>
                ≈ ${currencyOutBalance?.usdAmount?.toFixed(2) || "0"}
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

        <PrimaryButton size="XL" text="Swap" fullWidth disabled={!amountIn} />
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
  amount: {
    textAlign: "right",
  },
});
