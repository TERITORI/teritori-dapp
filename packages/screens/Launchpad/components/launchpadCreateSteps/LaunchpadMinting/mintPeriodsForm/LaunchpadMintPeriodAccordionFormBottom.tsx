import React, { FC } from "react";
import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFormContext,
} from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CsvTextFileUploader } from "@/components/inputs/CsvTextFileUploader";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { patternOnlyNumbers } from "@/utils/formRules";
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

export const LaunchpadMintPeriodAccordionFormBottom: FC<{
  elem: CollectionMintPeriodFormValues;
  update: UseFieldArrayUpdate<CollectionFormValues>;
  remove: UseFieldArrayRemove;
  elemIndex: number;
}> = ({ elem, elemIndex, remove, update }) => {
  const collectionForm = useFormContext<CollectionFormValues>();
  // TODO: Handle this in collectionForm
  const unitPriceKey = `mintPeriods.${elemIndex}.unitPrice` as const;
  const denomKey = `mintPeriods.${elemIndex}.denom` as const;
  const startTimeKey = `mintPeriods.${elemIndex}.startTime` as const;
  const endTimeKey = `mintPeriods.${elemIndex}.endTime` as const;
  const maxTokensKey = `mintPeriods.${elemIndex}.maxTokens` as const;
  const perAddressLimitKey =
    `mintPeriods.${elemIndex}.perAddressLimit` as const;
  const mintingPeriods = collectionForm.watch("mintPeriods");

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x1,
        paddingBottom: layout.spacing_x1,
      }}
    >
      {/*TODO: Make an input "currency" that embeds denom + amount (used for unitPriceKey and denomKey here)*/}
      <TextInputLaunchpad<CollectionFormValues>
        label="Mint Price"
        placeHolder="0"
        name={unitPriceKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Mint price for this period
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
        onChangeText={(text) => update(elemIndex, { ...elem, unitPrice: text })}
      />
      <TextInputLaunchpad<CollectionFormValues>
        label="Mint Denom"
        placeHolder="TORI"
        name={denomKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Currency used for this mint period
            </BrandText>
          </View>
        }
        control={collectionForm.control}
      />

      {/*TODO: Make an input "number" that can be sync with CollectionFormValues without having to set onChangeText and value*/}
      <TextInputLaunchpad<CollectionFormValues>
        label="Max Tokens"
        placeHolder="0"
        name={maxTokensKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of mintable tokens
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
        onChangeText={(text) =>
          update(elemIndex, { ...elem, maxTokens: parseInt(text, 10) })
        }
      />

      <TextInputLaunchpad<CollectionFormValues>
        label="Per Address Limit"
        placeHolder="0"
        name={perAddressLimitKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of mintable tokens per address
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
        onChangeText={(text) =>
          update(elemIndex, { ...elem, perAddressLimit: parseInt(text, 10) })
        }
      />

      <TextInputLaunchpad<CollectionFormValues>
        label="Start Time"
        placeHolder="dd.mm.yyyy | hh:mm PM"
        name={startTimeKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Start time for minting tokens
            </BrandText>
          </View>
        }
        control={collectionForm.control}
      />

      <TextInputLaunchpad<CollectionFormValues>
        label="End Time"
        placeHolder="dd.mm.yyyy | hh:mm PM"
        name={endTimeKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              End time for minting tokens
            </BrandText>
          </View>
        }
        control={collectionForm.control}
      />

      <Separator />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Whitelist Addresses</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Select a TXT or CSV file that contains the whitelisted addresses (One
        address per line)
      </BrandText>

      <SpacerColumn size={2} />
      <CsvTextFileUploader
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
        (elemIndex > 0 || mintingPeriods.length > 1) && (
          <>
            <SpacerColumn size={1} />
            <Separator />
            <SpacerColumn size={2} />
            <View
              style={{
                marginBottom: layout.spacing_x1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                  Remove Minting Period
                </BrandText>
              </TouchableOpacity>
            </View>
          </>
        )
      }
    </View>
  );
};
