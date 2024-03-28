import React, { FC } from "react";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SelectFileUploader } from "@/components/selectFileUploader";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { NetworkFeature, getNetworkFeature } from "@/networks";
import { TextInputLaunchpadRequired } from "@/screens/Launchpad/components/inputs/TextInputLaunchpadRequired";
import { LaunchpadWhitelistsAccordionFormProps } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/LaunchpadMintWhitelistAccordionForm";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT } from "@/utils/social-feed";
import { errorColor, neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

type Props = Omit<LaunchpadWhitelistsAccordionFormProps, "closeOtherElems">;

export const LaunchpadMintWhitelistAccordionFormBottom: FC<Props> = ({
  networkId,
  control,
  elem: whitelist,
  elemIndex: whitelistIndex,
  remove,
  update,
  setIsLoading,
}) => {
  const unitPriceKey = `whitelists.${whitelistIndex}.unitPrice` as const;
  const startTimeKey = `whitelists.${whitelistIndex}.startTime` as const;
  const endTimeKey = `whitelists.${whitelistIndex}.endTime` as const;
  const perAddressLimitKey =
    `whitelists.${whitelistIndex}.perAddressLimit` as const;

  const config = getNetworkFeature(networkId, NetworkFeature.NFTLaunchpad);
  const whitelistPriceDenom = whitelist?.denom || config?.defaultMintDenom;

  const onUploadWhitelistFile = (files: LocalFileData[]) => {
    // TODO: Parse addresses from the TXT file and createCollectionForm.setValue("whitelistAddresses", blabla)
  };

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x1,
        paddingBottom: layout.spacing_x1,
      }}
    >
      <TextInputLaunchpadRequired
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
      />

      <TextInputLaunchpadRequired
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
      />

      <TextInputLaunchpadRequired
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
      />

      <TextInputLaunchpadRequired
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
      />

      <Separator />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Whitelist File</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        TXT file that contains the whitelisted addresses
      </BrandText>
      <SpacerColumn size={2} />

      <SelectFileUploader
        label="Select file"
        fileHeight={ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT}
        isImageCover
        style={{
          marginBottom: layout.spacing_x2,
        }}
        containerHeight={48}
        onUpload={onUploadWhitelistFile}
        mimeTypes={IMAGE_MIME_TYPES}
      />

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
