import React from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../CreateCollection.type";
import { ConfigureRoyaltyDetails } from "../../ConfigureRoyaltyDetails";

import { BrandText } from "@/components/BrandText";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { MintWhitelistsForm } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/mintWhitelistsForm/MintWhitelistsForm";
import { patternOnlyNumbers } from "@/utils/formRules";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadMinting: React.FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.spacing_x2,
      }}
    >
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Minting details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Information about your minting settings
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Number of Tokens "
          placeHolder="0"
          name="nbTokens"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyNumbers }}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Unit Price"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Price of each token (min. 50 TORI)
              </BrandText>
            </View>
          }
          placeHolder="0"
          name="unitPrice"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyNumbers }}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Per Address Limit "
          placeHolder="0"
          name="perAddressLimit"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyNumbers }}
        />

        <Separator />
        <SpacerColumn size={2} />
        <BrandText style={fontSemibold20}>Whitelist Minting Details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Information about your minting settings
        </BrandText>

        <MintWhitelistsForm />

        <SpacerColumn size={1} />
        <Separator />
        <ConfigureRoyaltyDetails />
      </View>
    </View>
  );
};
