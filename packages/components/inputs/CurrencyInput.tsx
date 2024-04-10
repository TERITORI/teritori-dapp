import { Decimal } from "@cosmjs/math";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { StyleProp, TextInput, TextInputProps, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { Box, BoxStyle } from "@/components/boxes/Box";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { MaxButton } from "@/components/buttons/MaxButton";
import { MinButton } from "@/components/buttons/MinButton";
import { SelectableCurrencySmall } from "@/components/currency/SelectableCurrencySmall";
import { SelectedCurrencySmall } from "@/components/currency/SelectedCurrencySmall";
import { Label } from "@/components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useCoingeckoPrices } from "@/hooks/useCoingeckoPrices";
import { useDropdowns } from "@/hooks/useDropdowns";
import { allNetworks, getNativeCurrency, MinMaxedCurrency } from "@/networks";
import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { isFloatText } from "@/utils/text";

interface CurrencyInputCustomProps<T extends FieldValues>
  extends Omit<TextInputProps, "accessibilityRole" | "defaultValue"> {
  label: string;
  placeHolder?: string;
  control: Control<T>;
  name: Path<T>;
  subtitle?: React.ReactElement;
  sublabel?: React.ReactElement;
  required?: boolean;
  hideUsdAmount?: boolean;
  networkId: string;
  currencies: MinMaxedCurrency[];
  selectedCurrency: MinMaxedCurrency;
  onSelectCurrency: (currency: MinMaxedCurrency) => void;
  onChangeAmountAtomics: (amountAtomics: string) => void;
  boxStyle?: StyleProp<BoxStyle>;
}

export const CurrencyInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeHolder = "9999.9999",
  sublabel,
  subtitle,
  required,
  hideUsdAmount,
  networkId,
  currencies,
  selectedCurrency,
  onSelectCurrency,
  onChangeAmountAtomics,
  boxStyle,
}: CurrencyInputCustomProps<T>) => {
  const selectedCurrencyNetwork = allNetworks.find(
    (network) =>
      !!network.currencies.find(
        (currency) => currency.denom === selectedCurrency.denom,
      ),
  );
  const selectedNativeCurrency = getNativeCurrency(
    networkId,
    selectedCurrency.denom,
  );
  const inputRef = useRef<TextInput>(null);
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();
  const [hovered, setHovered] = useState(false);
  const [boxHeight, setBoxHeight] = useState(0);
  const { prices } = useCoingeckoPrices([
    { networkId, denom: selectedCurrency?.denom },
  ]);
  const max = selectedCurrency.maxAtomics
    ? Decimal.fromAtomics(
        selectedCurrency.maxAtomics || "",
        selectedNativeCurrency?.decimals || 0,
      ).toFloatApproximation()
    : undefined;
  const min = selectedCurrency.maxAtomics
    ? Decimal.fromAtomics(
        selectedCurrency.minAtomics || "",
        selectedNativeCurrency?.decimals || 0,
      ).toFloatApproximation()
    : undefined;

  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: { required, max, min },
  });

  const fieldError = useMemo(() => {
    if (fieldState.error) {
      if (fieldState.error.message) {
        return fieldState.error.message;
      }
      return DEFAULT_FORM_ERRORS.required;
    }
  }, [fieldState.error]);

  const amountUsd: number =
    useMemo(() => {
      if (
        !selectedNativeCurrency ||
        parseFloat(field.value) === 0 ||
        !prices[selectedNativeCurrency.coingeckoId]
      )
        return 0;
      return (
        parseFloat(field.value) * prices[selectedNativeCurrency.coingeckoId].usd
      );
    }, [selectedNativeCurrency, field.value, prices]) || 0;

  const onChangeText = (text: string) => {
    if (!text) {
      field.onChange("");
      onChangeAmountAtomics("0");
      return;
    }
    if (!selectedNativeCurrency) return;

    if (isFloatText(text)) {
      field.onChange(text);
      onChangeAmountAtomics(
        Decimal.fromUserInput(text, selectedNativeCurrency.decimals).atomics,
      );
    }
  };

  const onPressMax = () => {
    if (!selectedNativeCurrency || !selectedCurrency.maxAtomics) return;

    field.onChange(
      Decimal.fromAtomics(
        selectedCurrency.maxAtomics,
        selectedNativeCurrency.decimals,
      ).toString(),
    );

    onChangeAmountAtomics(selectedCurrency.maxAtomics);
  };

  const onPressMin = () => {
    if (!selectedNativeCurrency || !selectedCurrency.minAtomics) return;

    field.onChange(
      Decimal.fromAtomics(
        selectedCurrency.minAtomics,
        selectedNativeCurrency.decimals,
      ).toString(),
    );
    onChangeAmountAtomics(selectedCurrency.minAtomics);
  };

  const onPressSelectableCurrency = (currency: MinMaxedCurrency) => {
    onSelectCurrency(currency);
    field.onChange("");
    onChangeAmountAtomics("0");
    setDropdownState(false);
  };

  if (!selectedCurrencyNetwork) return <BrandText>Invalid network</BrandText>;
  return (
    <CustomPressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => inputRef?.current?.focus()}
      style={{ zIndex: 1 }}
    >
      {/*---- Label*/}
      {label && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Label hovered={hovered} isRequired={required}>
              {label}
            </Label>
            {subtitle}
          </View>
          {sublabel && sublabel}
          <SpacerColumn size={1.5} />
        </>
      )}
      <View onLayout={(e) => setBoxHeight(e.nativeEvent.layout.height)}>
        <Box
          style={[
            {
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: layout.spacing_x1_5,
              paddingVertical:
                selectedCurrency.maxAtomics ||
                selectedCurrency.minAtomics ||
                !hideUsdAmount
                  ? layout.spacing_x1_5
                  : layout.spacing_x1,
              backgroundColor: neutral00,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: neutral33,
            },
            hovered && { borderColor: secondaryColor },
            boxStyle,
          ]}
        >
          <View style={{ flex: 1 }}>
            {/*---- Input*/}
            <TextInput
              ref={inputRef}
              placeholder={placeHolder}
              onChangeText={onChangeText}
              placeholderTextColor={neutral77}
              value={field.value}
              style={[
                fontSemibold14,
                { outlineStyle: "none" } as any,
                {
                  color: secondaryColor,
                },
              ]}
            />

            {/*---- Amount in USD*/}
            {!hideUsdAmount && (
              <>
                <SpacerColumn size={0.5} />
                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      color: neutralA3,
                    },
                  ]}
                  numberOfLines={1}
                >
                  ≈ ${parseFloat(amountUsd.toFixed(2).toString())}
                </BrandText>
              </>
            )}
          </View>

          <SpacerRow size={1.5} />

          <View style={{ alignItems: "flex-end" }}>
            {/*---- Min/max buttons*/}
            {(selectedCurrency.maxAtomics || selectedCurrency.minAtomics) && (
              <>
                <View style={{ flexDirection: "row" }}>
                  {selectedCurrency.maxAtomics && (
                    <>
                      <MaxButton onPress={onPressMax} />
                      {selectedCurrency.minAtomics && <SpacerRow size={1} />}
                    </>
                  )}
                  {selectedCurrency.minAtomics && (
                    <>
                      <MinButton onPress={onPressMin} />
                    </>
                  )}
                </View>
                <SpacerColumn size={0.5} />
              </>
            )}
            {/*---- Selected currency*/}
            <SelectedCurrencySmall
              currency={selectedNativeCurrency}
              selectedNetworkId={selectedCurrencyNetwork.id}
              ref={dropdownRef}
              isDropdownOpen={isDropdownOpen}
              setDropdownState={setDropdownState}
              disabled={!currencies?.length}
            />
          </View>

          {/*---- Dropdown selectable currencies */}
          {currencies?.length && isDropdownOpen && (
            <View
              style={{
                position: "absolute",
                paddingHorizontal: layout.spacing_x1,
                paddingRight: layout.spacing_x2,
                paddingBottom: layout.spacing_x1,
                right: 0,
                top: boxHeight + 2,
                backgroundColor: neutral17,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: neutral33,
              }}
            >
              {currencies?.map((currencyInfo, index) => (
                <Fragment key={index}>
                  <SpacerColumn size={1} />
                  <SelectableCurrencySmall
                    currency={currencyInfo}
                    networkId={networkId}
                    onPressItem={() => onPressSelectableCurrency(currencyInfo)}
                  />
                </Fragment>
              ))}
            </View>
          )}
        </Box>
      </View>

      {/*----Errors */}
      <ErrorText>{fieldError}</ErrorText>
    </CustomPressable>
  );
};
