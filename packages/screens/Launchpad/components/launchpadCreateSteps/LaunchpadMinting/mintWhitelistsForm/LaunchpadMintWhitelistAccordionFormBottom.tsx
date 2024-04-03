import React, { FC, useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CsvTextFileUploader } from "@/components/inputs/CsvTextFileUploader";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { CollectionFormValues } from "@/screens/Launchpad/CreateCollection.type";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { patternOnlyNumbers } from "@/utils/formRules";
import { errorColor, neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  elem: FieldArrayWithId<CollectionFormValues, "whitelistMintInfos", "id">;
  remove: UseFieldArrayRemove;
  elemIndex: number;
};

export const LaunchpadMintWhitelistAccordionFormBottom: FC<Props> = ({
  elem,
  elemIndex,
  remove,
}) => {
  const collectionForm = useFormContext<CollectionFormValues>();
  // TODO: Handle this in collectionForm
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([]);

  const unitPriceKey = `whitelistMintInfos.${elemIndex}.unitPrice` as const;
  const startTimeKey = `whitelistMintInfos.${elemIndex}.startTime` as const;
  const endTimeKey = `whitelistMintInfos.${elemIndex}.endTime` as const;
  const perAddressLimitKey =
    `whitelistMintInfos.${elemIndex}.perAddressLimit` as const;

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x1,
        paddingBottom: layout.spacing_x1,
      }}
    >
      <TextInputLaunchpad
        label="Unit Price "
        placeHolder="0"
        name={unitPriceKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Token price for whitelisted addressess (min. 25 TORI)
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
      />

      <TextInputLaunchpad
        label="Per Address Limit"
        placeHolder="0"
        name={perAddressLimitKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of tokens per whitelisted address
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
      />

      <TextInputLaunchpad
        label="Start Time "
        placeHolder="0"
        name={startTimeKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Start time for minting tokens to whitelisted addresses
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
      />

      <TextInputLaunchpad
        label="End Time "
        placeHolder="0"
        name={endTimeKey}
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              End time for minting tokens to whitelisted addresses
            </BrandText>
          </View>
        }
        control={collectionForm.control}
        rules={{ pattern: patternOnlyNumbers }}
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
        rows={whitelistAddresses}
        setRows={setWhitelistAddresses}
      />

      <SpacerColumn size={2} />
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
            Remove Whitelist
          </BrandText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
