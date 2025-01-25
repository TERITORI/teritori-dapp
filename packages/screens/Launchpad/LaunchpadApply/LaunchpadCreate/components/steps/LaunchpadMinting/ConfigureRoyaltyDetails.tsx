import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import { fontMedium13, fontMedium14, fontMedium20 } from "@/utils/style/fonts";
import { CollectionFormValues } from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const ConfigureRoyaltyDetails: FC<Props> = ({ collectionForm }) => {
  return (
    <View style={{ maxWidth: launchpadCreateFormMaxWidth }}>
      <SpacerColumn size={2} />
      <BrandText style={fontMedium20}>Royalty Details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontMedium14, { color: neutral77 }]}>
        Configure royalties
      </BrandText>
      <SpacerColumn size={2} />

      <TextInputLaunchpad<CollectionFormValues>
        label="Payment Address "
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="royaltyAddress"
        sublabel={
          <View>
            <BrandText style={[fontMedium13, { color: neutral55 }]}>
              Address to receive royalties
            </BrandText>
          </View>
        }
        form={collectionForm}
        required={false}
      />

      <TextInputLaunchpad<CollectionFormValues>
        label="Share Percentage "
        placeHolder="8%"
        name="royaltyPercentage"
        sublabel={
          <View>
            <BrandText style={[fontMedium13, { color: neutral55 }]}>
              Percentage of royalties to be paid
            </BrandText>
          </View>
        }
        form={collectionForm}
        required={false}
      />
    </View>
  );
};
