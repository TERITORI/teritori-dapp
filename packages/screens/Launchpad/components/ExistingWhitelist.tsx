import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadRequired } from "./inputs/TextInputLaunchpadRequired";
import { CreateCollectionFormValues } from "../CreateCollection.type";

import { SpacerColumn } from "@/components/spacer";

export const ExistingWhitelist: React.FC<{
  createCollectionForm: UseFormReturn<CreateCollectionFormValues>;
}> = ({ createCollectionForm }) => {
  return (
    <View
      style={{
        maxWidth: 416,
      }}
    >
      <SpacerColumn size={2} />

      <TextInputLaunchpadRequired<CreateCollectionFormValues>
        label="Whitelist Address"
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="whitelistAddress"
        control={createCollectionForm.control}
      />
    </View>
  );
};
