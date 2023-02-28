import { Decimal } from "cosmwasm";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

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
import { useDropdowns } from "../../../context/DropdownsProvider";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useBalances } from "../../../hooks/useBalances";
import { useCoingeckoPrices } from "../../../hooks/useCoingeckoPrices";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useSwap } from "../../../hooks/useSwap";
import {
  allNetworks,
  CosmosNetworkInfo,
  CurrencyInfo,
  getNativeCurrency,
  NativeCurrencyInfo,
} from "../../../networks";
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
import { isFloatText } from "../../../utils/text";
import { CurrencyAmount } from "./CurrencyAmount";
import { SelectedCurrency } from "./SelectedCurrency";
import { SwapDetails } from "./SwapDetails";
import { SwapModalSettings } from "./SwapModalSettings";
import { SwapModalTokenList } from "./SwapModalTokenList";

type SwapModalProps = {
  onClose: () => void;
  visible: boolean;
};

const INVERT_ANIMATION_DURATION = 200;

//TODO: Amounts not refreshed (Assets, etc..)
//TODO:  fix errors useSwap

export const ModalHeader: React.FC<{
  setSettingsOpened?: Dispatch<SetStateAction<boolean>>;
  networkDisplayName?: string;
}> = ({ setSettingsOpened, networkDisplayName }) => {
  const styles = StyleSheet.create({
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
  });

  return (
    <>
      <View style={styles.modalHeaderContainer}>
        <View style={styles.modalHeaderLogoTitle}>
          <SVG source={osmosisLogo} height={32} width={32} />
          <BrandText style={styles.modalHeaderTitle}>
            Swap on {networkDisplayName || "Osmosis"}
          </BrandText>
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
  // ==== Animations
  const opacity = useRef(new Animated.Value(1)).current;
  const translateToTop = useRef(new Animated.Value(0)).current;
  const translateToBottom = useRef(new Animated.Value(0)).current;
  const opacityFunction = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: INVERT_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: INVERT_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const translateRangeToTop = translateToTop.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const translateRangeToBottom = translateToBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const toBottomFunction = () => {
    Animated.sequence([
      Animated.timing(translateToBottom, {
        toValue: 1,
        duration: INVERT_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateToBottom, {
        toValue: 0,
        duration: INVERT_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toTopFunction = () => {
    Animated.sequence([
      Animated.timing(translateToTop, {
        toValue: 1,
        duration: INVERT_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateToTop, {
        toValue: 0,
        duration: INVERT_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };
  // =========

  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedNetwork = useSelectedNetworkInfo();

  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const modalWidth = 456;

  const cosmosNetwork = allNetworks.find(
    (networkInfo) => networkInfo.id === "cosmos-hub"
  ) as CosmosNetworkInfo;
  const teritoriNetwork = allNetworks.find(
    (networkInfo) => networkInfo.id === "teritori"
  ) as CosmosNetworkInfo;

  // ---- Default currencies
  const atomCurrency = useMemo(
    () =>
      selectedNetwork?.currencies.find(
        (currencyInfo) =>
          getNativeCurrency(selectedNetworkId, currencyInfo?.denom)?.denom ===
          cosmosNetwork?.stakeCurrency
      ),
    [
      selectedNetwork?.currencies,
      cosmosNetwork?.stakeCurrency,
      selectedNetworkId,
    ]
  );
  const toriCurrency = useMemo(
    () =>
      selectedNetwork?.currencies.find(
        (currencyInfo) =>
          getNativeCurrency(selectedNetworkId, currencyInfo?.denom)?.denom ===
          teritoriNetwork?.stakeCurrency
      ),
    [
      selectedNetwork?.currencies,
      teritoriNetwork?.stakeCurrency,
      selectedNetworkId,
    ]
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
    [currencyIn?.denom, selectedNetworkId]
  );
  const currencyOutNative: NativeCurrencyInfo | undefined = useMemo(
    () => getNativeCurrency(selectedNetworkId, currencyOut?.denom),
    [currencyOut?.denom, selectedNetworkId]
  );
  // ---- Displayed and selectable currencies
  const selectableCurrencies = useMemo(
    () =>
      selectedNetwork?.currencies.filter(
        (currencyInfo) =>
          currencyIn?.denom !== currencyInfo.denom &&
          currencyOut?.denom !== currencyInfo.denom &&
          ((currencyInfo.kind === "ibc" && !currencyInfo.deprecated) ||
            currencyInfo.kind === "native")
      ),
    [currencyIn?.denom, currencyOut?.denom, selectedNetwork?.currencies]
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
  }, [currencyInBalance, currencyInNative]);
  // ---- Current amounts (The user enters amountIn)
  const [amountIn, setAmountIn] = useState("");

  const { prices } = useCoingeckoPrices([
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
  }, [currencyInNative, amountIn, prices]);

  // ---- Settings
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [slippage, setSlippage] = useState(1);

  // ---- Dropdowns
  const { isDropdownOpen, closeOpenedDropdown } = useDropdowns();
  const [dropdownOutRef, setDropdownOutRef] = useState<RefObject<any> | null>(
    null
  );
  const [dropdownInRef, setDropdownInRef] = useState<RefObject<any> | null>(
    null
  );

  const onChangeAmountIn = (text: string) => {
    if (!text) {
      setAmountIn("");
      return;
    }
    if (isFloatText(text)) setAmountIn(text);
  };

  // ---- Buttons
  const onPressInvert = () => {
    opacityFunction();
    toBottomFunction();
    toTopFunction();
    setTimeout(() => {
      setCurrencyIn(currencyOut);
      setCurrencyOut(currencyIn);
      setAmountIn(amountOutWithFee ? amountOutWithFee.toFixed(6) : "");
    }, INVERT_ANIMATION_DURATION);
  };
  const onPressHalf = () => {
    setAmountIn((parseFloat(currencyInAmount) / 2).toString());
  };
  const onPressMax = () => {
    setAmountIn(parseFloat(currencyInAmount).toString());
  };
  const onPressSwap = async () => {
    const swapResult = await swap(parseFloat(amountIn), amountOut, slippage);
    setSettingsOpened(false);

    if (swapResult?.isError) {
      setToastError({
        title: swapResult?.title || "Error",
        message: swapResult?.message || "Error",
      });
    } else {
      setToastSuccess({
        title: swapResult?.title || "Success",
        message: "",
      });
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
  const { swap, spotPrice, fee } = useSwap(currencyIn, currencyOut);

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
  }, [currencyOutNative, amountOut, prices, fee]);

  // ---- USD price for the second currency (With fee)
  const amountOutUsdWithFee: number = useMemo(() => {
    if (
      !currencyOutNative ||
      !amountOutWithFee ||
      !prices[currencyOutNative.coingeckoId]
    )
      return 0;
    return amountOutWithFee * prices[currencyOutNative.coingeckoId].usd;
  }, [currencyOutNative, amountOutWithFee, prices]);

  // ===== RETURN
  return (
    <ModalBase
      childrenBottom={
        <>
          {/*======= Set slippage */}
          <SwapModalSettings
            settingsOpened={settingsOpened}
            setSlippageValue={setSlippage}
          />
          {/*======= Selectable currencies in */}
          <SwapModalTokenList
            isOpened={!!dropdownOutRef && isDropdownOpen(dropdownOutRef)}
            close={closeOpenedDropdown}
            width={modalWidth}
            currencies={selectableCurrencies}
            selectedNetworkId={selectedNetworkId}
            setCurrency={setCurrencyOut}
          />
          {/*======= Selectable currencies out */}
          <SwapModalTokenList
            isOpened={!!dropdownInRef && isDropdownOpen(dropdownInRef)}
            close={closeOpenedDropdown}
            width={modalWidth}
            currencies={selectableCurrencies}
            selectedNetworkId={selectedNetworkId}
            setCurrency={setCurrencyIn}
          />
        </>
      }
      Header={() => (
        <ModalHeader
          setSettingsOpened={setSettingsOpened}
          networkDisplayName={selectedNetwork?.displayName}
        />
      )}
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
            <Animated.View
              style={{
                opacity,
                width: "100%",
                transform: [{ translateY: translateRangeToBottom }],
              }}
            >
              <View style={styles.currency}>
                <SelectedCurrency
                  currency={currencyInNative}
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
            </Animated.View>
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
              <Animated.View
                style={{
                  opacity,
                  width: "100%",
                  transform: [{ translateY: translateRangeToTop }],
                }}
              >
                <View style={styles.currency}>
                  <SelectedCurrency
                    currency={currencyOutNative}
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
              </Animated.View>
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
