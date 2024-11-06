import React, { FC } from "react";
import {
  Controller,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFormContext,
} from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { SVG } from "@/components/SVG";
import { CsvTextRowsInput } from "@/components/inputs/CsvTextRowsInput";
import { DateTimeInput } from "@/components/inputs/DateTimeInput";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getCurrency } from "@/networks";
import { CurrencyInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/CurrencyInputLaunchpad/CurrencyInputLaunchpad";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { errorColor, neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionFormValues,
  CollectionMintPeriodFormValues,
} from "@/utils/types/launchpad";

export const LaunchpadMintPeriodAccordionBottom: FC<{
  elem: CollectionMintPeriodFormValues;
  update: UseFieldArrayUpdate<CollectionFormValues, "mintPeriods">;
  remove: UseFieldArrayRemove;
  elemIndex: number;
}> = ({ elem, elemIndex, remove, update }) => {
  // Since the Collection network is the selected network, we use useSelectedNetworkId (See LaunchpadBasic.tsx)
  const networkId = useSelectedNetworkId();
  const collectionForm = useFormContext<CollectionFormValues>();
  const amountPath = `mintPeriods.${elemIndex}.price.amount` as const;
  const startTimePath = `mintPeriods.${elemIndex}.startTime` as const;
  const endTimePath = `mintPeriods.${elemIndex}.endTime` as const;
  const maxTokensPath = `mintPeriods.${elemIndex}.maxTokens` as const;
  const perAddressLimitPath =
    `mintPeriods.${elemIndex}.perAddressLimit` as const;
  const mintPeriods = collectionForm.watch("mintPeriods");
  const amount = collectionForm.watch(amountPath);
  const startTime = collectionForm.watch(startTimePath);
  const endTime = collectionForm.watch(endTimePath);
  const selectedCurrency = getCurrency(networkId, elem.price.denom);

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x1,
        paddingBottom: layout.spacing_x1,
      }}
    >
      <Controller<CollectionFormValues>
        name={amountPath}
        control={collectionForm.control}
        render={({ field: { onChange } }) => (
          <>
            <CurrencyInputLaunchpad
              label="Mint Price and Currency"
              networkId={networkId}
              amountAtomics={amount}
              currency={selectedCurrency}
              onSelectCurrency={(currency) => {
                update(elemIndex, {
                  ...elem,
                  price: { ...elem.price, denom: currency.denom },
                });
              }}
              onChangeAmountAtomics={(amountAtomics) => {
                onChange(amountAtomics);
              }}
              required={false}
            />
            <ErrorText>
              {collectionForm.getFieldState(amountPath).error?.message}
            </ErrorText>
          </>
        )}
      />
      <SpacerColumn size={2} />

      <TextInputLaunchpad<CollectionFormValues>
        label="Max Tokens"
        placeHolder="0"
        name={maxTokensPath}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of mintable tokens
            </BrandText>
          </View>
        }
        form={collectionForm}
        required={false}
      />

      <TextInputLaunchpad<CollectionFormValues>
        label="Per Address Limit"
        placeHolder="0"
        name={perAddressLimitPath}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of mintable tokens per address
            </BrandText>
          </View>
        }
        form={collectionForm}
        required={false}
      />

      <Controller<CollectionFormValues>
        name={startTimePath}
        control={collectionForm.control}
        render={({ field: { onChange } }) => (
          <DateTimeInput
            label="Start Time"
            onChange={onChange}
            timestamp={startTime}
            isDirty={collectionForm.getFieldState(startTimePath).isDirty}
          />
        )}
      />
      <SpacerColumn size={2} />

      <Controller<CollectionFormValues>
        name={endTimePath}
        control={collectionForm.control}
        render={({ field: { onChange } }) => (
          <DateTimeInput
            label="End Time"
            onChange={onChange}
            timestamp={endTime}
            isDirty={collectionForm.getFieldState(endTimePath).isDirty}
            required={false}
          />
        )}
      />
      <SpacerColumn size={2} />

      <Separator />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Whitelist Addresses</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Select a TXT or CSV file that contains the whitelisted addresses (One
        address per line)
      </BrandText>

      <SpacerColumn size={2} />
      <CsvTextRowsInput
        rows={elem.whitelistAddresses}
        file={elem.whitelistAddressesFile}
        onUpload={(file, rows) =>
          update(elemIndex, {
            ...elem,
            whitelistAddressesFile: file,
            whitelistAddresses: rows,
          })
        }
      />
      <SpacerColumn size={1} />

      {
        // Can remove periods only if more than one (There will be least one period left)
        (elemIndex > 0 || mintPeriods.length > 1) && (
          <>
            <SpacerColumn size={1} />
            <Separator />
            <SpacerColumn size={2} />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 32,
                paddingHorizontal: layout.spacing_x2,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: errorColor,
                marginBottom: layout.spacing_x1,
              }}
              onPress={() => remove(elemIndex)}
            >
              <SVG source={trashSVG} width={16} height={16} />
              <SpacerRow size={1} />
              <BrandText
                style={[
                  fontSemibold14,
                  { color: errorColor, lineHeight: layout.spacing_x2 },
                ]}
              >
                Remove Mint Period
              </BrandText>
            </TouchableOpacity>
          </>
        )
      }
    </View>
  );
};
