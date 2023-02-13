import { Decimal } from "cosmwasm";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import chevronCircleDown from "../../../../assets/icons/chevron-circle-down.svg";
import chevronCircleUp from "../../../../assets/icons/chevron-circle-up.svg";
import osmosisLogo from "../../../../assets/icons/networks/osmosis.svg";
import settingsSVG from "../../../../assets/icons/settings.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { ToastError } from "../../../components/toasts/ToastError";
import { ToastSuccess } from "../../../components/toasts/ToastSuccess";
import { DropdownRef, useDropdowns } from "../../../context/DropdownsProvider";
import { useBalances } from "../../../hooks/useBalances";
import { useCoingeckoPrices } from "../../../hooks/useCoingeckoPrices";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { SwapResult, useSwap } from "../../../hooks/useSwap";
import {
  CurrencyInfo,
  getNativeCurrency,
  getNetwork,
  isNetworkTestnet,
  NativeCurrencyInfo,
} from "../../../networks";
import { NetworkName } from "../../../networks/NetworkName";
import { selectSelectedNetworkId } from "../../../store/slices/settings";
import { Balance } from "../../../utils/coins";
import {
  neutral00,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  toastErrorWidth,
  toastSuccessWidth,
} from "../../../utils/style/toasts";
import { isFloatText } from "../../../utils/text";
import { CurrencyAmount } from "./CurrencyAmount";
import { SelectableCurrency } from "./SelectableCurrency";
import { SelectedCurrency } from "./SelectedCurrency";
import { SwapDetails } from "./SwapDetails";
import { SwapModalSettings } from "./SwapModalSettings";

type SwapModalProps = {
  onClose: () => void;
  visible: boolean;
};

//TODO: Amounts not refreshed (Assets, etc..)
//TODO:  fix errors useSwap

export const ModalHeader: React.FC<{
  setSettingsOpened?: Dispatch<SetStateAction<boolean>>;
}> = ({ setSettingsOpened }) => {
  return (
    <>
      <View style={styles.modalHeaderContainer}>
        <View style={styles.modalHeaderLogoTitle}>
          <SVG source={osmosisLogo} height={32} width={32} />
          <BrandText style={styles.modalHeaderTitle}>Swap on OSMOSIS</BrandText>
        </View>
        {setSettingsOpened && (
          <TouchableOpacity
            onPress={() => setSettingsOpened((isOpened) => !isOpened)}
          >
            <SVG source={settingsSVG} height={20} width={20} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

/////////////////// MODAL
export const SwapModal: React.FC<SwapModalProps> = ({ onClose, visible }) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const [swapResult, setSwapResult] = useState<SwapResult>();
  const [toastErrorVisible, setToastErrorVisible] = useState(false);
  const [toastSuccessVisible, setToastSuccessVisible] = useState(false);
  const modalWidth = 456;

  // ---- Default currencies
  const atomCurrency = useMemo(
    () =>
      selectedNetwork?.currencies.find(
        (currencyInfo) =>
          currencyInfo.sourceNetworkDisplayName ===
          (isNetworkTestnet(selectedNetworkId) ? NetworkName.CosmosHubTheta : NetworkName.CosmosHub)
      ),
    [selectedNetwork?.currencies]
  );
  const toriCurrency = useMemo(
    () =>
      selectedNetwork?.currencies.find(
        (currencyInfo) =>
          currencyInfo.sourceNetworkDisplayName ===
          (isNetworkTestnet(selectedNetworkId) ? NetworkName.TeritoriTestnet : NetworkName.Teritori)
      ),
    [selectedNetwork?.currencies]
  );

  useEffect(() => {
    setCurrencyIn(atomCurrency);
    setCurrencyOut(toriCurrency);
  }, [atomCurrency, toriCurrency]);

  // ---- The two current currencies
  const [currencyIn, setCurrencyIn] = useState<CurrencyInfo | undefined>(
    atomCurrency
  );
  const [currencyOut, setCurrencyOut] = useState<CurrencyInfo | undefined>(
    toriCurrency
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
  const [amountIn, setAmountIn] = useState("");

  const prices = useCoingeckoPrices([
    { networkId: selectedNetworkId, denom: currencyIn?.denom },
    { networkId: selectedNetworkId, denom: currencyOut?.denom },
  ]);
  // ---- USD price for the first currency
  const amountInUsd: number = useMemo(() => {
    if (
      !currencyInNative ||
      !amountIn ||
      parseFloat(amountIn) === 0 ||
      !prices[currencyInNative.coingeckoId]
    )
      return 0;
    return parseFloat(amountIn) * prices[currencyInNative.coingeckoId].usd;
  }, [currencyInNative?.coingeckoId, amountIn, prices]);

  // ---- Settings
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [slippage, setSlippage] = useState(1);

  // ---- Dropdowns
  const { isDropdownOpen, closeOpenedDropdown } = useDropdowns();
  const [dropdownOutRef, setDropdownOutRef] = useState<DropdownRef>(null);
  const [dropdownInRef, setDropdownInRef] = useState<DropdownRef>(null);

  const onChangeAmountIn = (text: string) => {
    if (!text) {
      setAmountIn("");
      return;
    }
    if (isFloatText(text)) setAmountIn(text);
  };

  // ---- Buttons
  const onPressInvert = () => {
    setCurrencyIn(currencyOut);
    setCurrencyOut(currencyIn);
    setAmountIn(amountOutWithFee ? amountOutWithFee.toFixed(6) : "");
  };
  const onPressHalf = () => {
    setAmountIn((parseFloat(currencyInAmount) / 2).toString());
  };
  const onPressMax = () => {
    setAmountIn(parseFloat(currencyInAmount).toString());
  };
  const onPressSwap = async () => {
    setSettingsOpened(false);
    setToastSuccessVisible(false);
    setToastErrorVisible(false);
    const swapResult = await swap(parseFloat(amountIn), amountOut, slippage);
    setSwapResult(swapResult);

    if (swapResult?.isError) setToastErrorVisible(true);
    else {
      setToastSuccessVisible(true);
      setAmountIn("");
    }
  };
  const onCloseModal = () => {
    setSettingsOpened(false);
    setSlippage(1);
    setAmountIn("");
    onClose();
  };

  // ---- SWAP OSMOSIS
  const { swap, spotPrice, fee, loading } = useSwap(currencyIn, currencyOut);

  const amountOut: number = useMemo(() => {
    if (!amountIn || parseFloat(amountIn) === 0 || !spotPrice) return 0;
    return parseFloat(spotPrice) * parseFloat(amountIn);
  }, [spotPrice, amountIn]);

  const amountOutWithFee: number = useMemo(
    () => amountOut - amountOut * fee,
    [amountOut, fee]
  );

  const feeAmountOutUsd: number = useMemo(() => {
    if (
      !currencyOutNative ||
      !amountOut ||
      !prices[currencyOutNative.coingeckoId]
    )
      return 0;
    return amountOut * fee * prices[currencyOutNative.coingeckoId].usd;
  }, [currencyOutNative?.coingeckoId, amountOut, prices, fee]);

  // ---- USD price for the second currency (With fee)
  const amountOutUsdWithFee: number = useMemo(() => {
    if (
      !currencyOutNative ||
      !amountOutWithFee ||
      !prices[currencyOutNative.coingeckoId]
    )
      return 0;
    return amountOutWithFee * prices[currencyOutNative.coingeckoId].usd;
  }, [currencyOutNative?.coingeckoId, amountOutWithFee, prices]);

  // ===== RETURN
  return (
    <ModalBase
      childrenBottom={
        <SwapModalSettings
          settingsOpened={settingsOpened}
          setSlippageValue={setSlippage}
        />
      }
      Header={() => <ModalHeader setSettingsOpened={setSettingsOpened} />}
      width={modalWidth}
      visible={visible}
      onClose={onCloseModal}
      contentStyle={{ justifyContent: "flex-start" }}
      closeButtonStyle={{ alignSelf: "center" }}
    >
      <View style={styles.modalChildrenContainer}>
        <View style={styles.currencies}>
          {/*======= First currency */}
          <TertiaryBox
            fullWidth
            mainContainerStyle={styles.currencyBoxMainContainer}
          >
            {/*----- Selected currencyIn available amount */}
            <View style={styles.counts}>
              <BrandText style={styles.availableAmount}>
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

            {/*----- Selected currencyIn*/}
            <View style={styles.currency}>
              <SelectedCurrency
                currency={currencyIn}
                selectedNetworkId={selectedNetworkId}
                setRef={setDropdownInRef}
              />

              {/*----- Desired amount for swap */}
              <View>
                <TextInput
                  style={styles.inputAmount}
                  value={amountIn}
                  placeholder="0"
                  placeholderTextColor={neutralA3}
                  onChangeText={onChangeAmountIn}
                />
                <BrandText style={styles.amountUsd}>
                  ≈ ${parseFloat(amountInUsd.toFixed(2).toString())}
                </BrandText>
              </View>
            </View>

            {/*======= Selectable currencies in */}
            {isDropdownOpen(dropdownInRef) && (
              <>
                {selectableCurrenciesIn?.map((currencyInfo, index) => (
                  <SelectableCurrency
                    key={index}
                    currency={currencyInfo}
                    networkId={selectedNetworkId}
                    onPressItem={() => {
                      setCurrencyIn(currencyInfo);
                      closeOpenedDropdown();
                    }}
                  />
                ))}
              </>
            )}
          </TertiaryBox>

          {/*======= Second currency */}
          <SpacerColumn size={1.5} />
          <TertiaryBox
            fullWidth
            mainContainerStyle={styles.currencyBoxMainContainer}
          >
            <>
              {/*----- Invert button */}
              <CustomPressable
                onPress={onPressInvert}
                style={styles.invertButton}
              >
                {({ hovered }) => (
                  <SVG
                    source={hovered ? chevronCircleDown : chevronCircleUp}
                    height={32}
                    width={32}
                  />
                )}
              </CustomPressable>

              {/*----- Selected currencyOut */}
              <View style={styles.currency}>
                <SelectedCurrency
                  currency={currencyOut}
                  selectedNetworkId={selectedNetworkId}
                  setRef={setDropdownOutRef}
                />

                {/*----- Amount earned after swap */}
                <CurrencyAmount
                  amount={amountOutWithFee}
                  amountUsd={amountOutUsdWithFee}
                  isApproximate
                />
              </View>

              {/*======= Selectable currencies out */}
              {isDropdownOpen(dropdownOutRef) && (
                <>
                  {selectableCurrenciesOut?.map((currencyInfo, index) => (
                    <SelectableCurrency
                      key={index}
                      currency={currencyInfo}
                      networkId={selectedNetworkId}
                      onPressItem={() => {
                        setCurrencyOut(currencyInfo);
                        closeOpenedDropdown();
                      }}
                    />
                  ))}
                </>
              )}
            </>
          </TertiaryBox>
        </View>

        {/*======= Currencies In/Out equivalence */}
        <SpacerColumn size={1.5} />
        <SwapDetails
          fee={fee}
          spotPrice={spotPrice || ""}
          amountIn={amountIn}
          tokenNameIn={currencyInNative?.displayName || ""}
          tokenNameOut={currencyOutNative?.displayName || ""}
          feeAmountOutUsd={feeAmountOutUsd}
          expectedAmountOut={amountOutWithFee}
          slippage={slippage}
        />

        {/*======= Swap button */}
        <SpacerColumn size={2.5} />
        <PrimaryButton
          size="XL"
          loader
          text={
            amountIn && parseFloat(amountIn) > parseFloat(currencyInAmount)
              ? "Insufficient balance"
              : "Swap"
          }
          fullWidth
          disabled={
            !amountIn ||
            parseFloat(amountIn) === 0 ||
            parseFloat(amountIn) > parseFloat(currencyInAmount)
          }
          onPress={onPressSwap}
        />
      </View>

      {/*======= Loader TODO: Ugly, polish that*/}
      {loading && (
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBackground} />
          <ActivityIndicator size="large" style={styles.loader} />
        </View>
      )}

      {/*======= We use Toastes here to get above the Modal*/}
      {toastErrorVisible && (
        <ToastError
          title={swapResult?.title || "Error"}
          onPress={() => setToastErrorVisible(false)}
          message={swapResult?.message || "Error"}
          style={{ left: modalWidth / 2 - toastErrorWidth / 2, top: -220 }}
        />
      )}
      {toastSuccessVisible && (
        <ToastSuccess
          title={swapResult?.title || "Success"}
          onPress={() => setToastSuccessVisible(false)}
          style={{ left: modalWidth / 2 - toastSuccessWidth / 2, top: -220 }}
        />
      )}
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: neutral00,
    opacity: 0.6,
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
  },

  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  modalHeaderLogoTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalHeaderTitle: {
    marginLeft: layout.padding_x2,
  },

  modalChildrenContainer: {
    alignItems: "center",
    paddingBottom: layout.padding_x2_5,
  },
  currencyBoxMainContainer: {
    padding: layout.padding_x2,
  },

  counts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: layout.padding_x2,
  },
  currencies: {
    width: "100%",
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
    top: -24,
  },
  availableAmount: {
    color: neutral77,
    ...StyleSheet.flatten(fontSemibold14),
  },
  inputAmount: {
    height: "100%",
    outlineStyle: "none",
    color: secondaryColor,
    maxWidth: 200,
    textAlign: "right",
    ...StyleSheet.flatten(fontSemibold20),
  },
  amount: {
    textAlign: "right",
  },
  amountUsd: {
    color: neutralA3,
    textAlign: "right",
    ...StyleSheet.flatten(fontSemibold14),
  },
});
