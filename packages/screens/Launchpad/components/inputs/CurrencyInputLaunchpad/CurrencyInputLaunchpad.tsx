import { Decimal } from "@cosmjs/math";
import React, { FC, Fragment, useRef, useState } from "react";
import { StyleProp, TextInput, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { Box, BoxStyle } from "@/components/boxes/Box";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Label } from "@/components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useDropdowns } from "@/hooks/useDropdowns";
import {
  allNetworks,
  CurrencyInfo,
  getNativeCurrency,
  getNetwork,
} from "@/networks";
import { SelectableCurrencySmall } from "@/screens/Launchpad/components/inputs/CurrencyInputLaunchpad/SelectableCurrencySmall";
import { SelectedCurrencySmall } from "@/screens/Launchpad/components/inputs/CurrencyInputLaunchpad/SelectedCurrencySmall";
import { validateFloatWithDecimals } from "@/utils/formRules";
import {
  errorColor,
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const CurrencyInputLaunchpad: FC<{
  label?: string;
  placeHolder?: string;
  subtitle?: React.ReactElement;
  sublabel?: React.ReactElement;
  required?: boolean;
  error?: string;
  networkId: string;
  onSelectCurrency: (currency: CurrencyInfo) => void;
  onChangeAmountAtomics: (amountAtomics: string) => void;
  amountAtomics?: string;
  currency?: CurrencyInfo;
  boxStyle?: StyleProp<BoxStyle>;
}> = ({
  label,
  placeHolder = "0",
  sublabel,
  subtitle,
  required = true,
  error,
  networkId,
  onSelectCurrency,
  onChangeAmountAtomics,
  boxStyle,
  amountAtomics,
  currency,
}) => {
  const network = getNetwork(networkId);
  const currencies: CurrencyInfo[] = network?.currencies || [];
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo>(
    currency || currencies[0],
  );
  const selectedCurrencyNetwork = allNetworks.find(
    (network) =>
      !!network.currencies.find(
        (currency) => currency.denom === selectedCurrency?.denom,
      ),
  );
  const selectedNativeCurrency = getNativeCurrency(
    selectedCurrencyNetwork?.id,
    selectedCurrency?.denom,
  );
  const [value, setValue] = useState(
    selectedNativeCurrency && amountAtomics
      ? Decimal.fromAtomics(
          amountAtomics,
          selectedNativeCurrency.decimals,
        ).toString()
      : "",
  );

  const inputRef = useRef<TextInput>(null);
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();
  const [hovered, setHovered] = useState(false);
  const boxHeight = 40;

  const onChangeText = (text: string) => {
    if (!text) {
      setValue("");
      onChangeAmountAtomics("");
      return;
    }

    if (
      selectedNativeCurrency &&
      validateFloatWithDecimals(text, selectedNativeCurrency.decimals)
    ) {
      setValue(text);
      onChangeAmountAtomics(
        Decimal.fromUserInput(
          text.endsWith(".") ? text + "0" : text,
          selectedNativeCurrency.decimals,
        ).atomics,
      );
    }
  };

  const onPressSelectableCurrency = (currency: CurrencyInfo) => {
    setValue("");
    setSelectedCurrency(currency);
    onChangeAmountAtomics("");
    onSelectCurrency(currency);
    setDropdownState(false);
  };

  if (!selectedCurrencyNetwork)
    return <BrandText style={{ color: errorColor }}>Invalid network</BrandText>;
  if (!selectedNativeCurrency)
    return (
      <BrandText style={{ color: errorColor }}>
        Invalid native currency
      </BrandText>
    );
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
      <Box
        notched
        style={[
          {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: layout.spacing_x1_5,
            height: boxHeight,
            backgroundColor: neutral22,
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
            value={value}
            style={[
              fontSemibold14,
              { outlineStyle: "none" } as any,
              {
                color: secondaryColor,
              },
            ]}
          />
        </View>

        <SpacerRow size={1.5} />

        {/*---- Selected currency*/}
        <SelectedCurrencySmall
          currency={selectedNativeCurrency}
          selectedNetworkId={selectedCurrencyNetwork?.id}
          ref={dropdownRef}
          isDropdownOpen={isDropdownOpen}
          setDropdownState={setDropdownState}
          disabled={!currencies?.length}
        />

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

      <ErrorText>{error}</ErrorText>
    </CustomPressable>
  );
};
