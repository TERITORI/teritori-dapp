import React, { FC, useState } from "react";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CsvTextFileUploader } from "@/components/inputs/CsvTextFileUploader";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { LaunchpadWhitelistsAccordionFormProps } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/LaunchpadMintWhitelistAccordionForm";
import { patternOnlyNumbers } from "@/utils/formRules";
import { errorColor, neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = Omit<
  LaunchpadWhitelistsAccordionFormProps,
  "closeOtherElems" | "collectionForm"
>;

export const LaunchpadMintWhitelistAccordionFormBottom: FC<Props> = ({
  control,
  elemIndex: whitelistIndex,
  remove,
}) => {
  // TODO: control.setValues("???", whitelistAddresses)
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([]);

  const unitPriceKey = `whitelists.${whitelistIndex}.unitPrice` as const;
  const startTimeKey = `whitelists.${whitelistIndex}.startTime` as const;
  const endTimeKey = `whitelists.${whitelistIndex}.endTime` as const;
  const perAddressLimitKey =
    `whitelists.${whitelistIndex}.perAddressLimit` as const;

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
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
          onPress={() => remove(whitelistIndex)}
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
