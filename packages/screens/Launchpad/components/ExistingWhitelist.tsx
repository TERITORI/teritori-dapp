import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadRequired } from "./inputs/TextInputLaunchpadRequired";
import { ExistingWhitelistDetailsFormValues } from "../CreateCollection.type";

import { SpacerColumn } from "@/components/spacer";

export const ExistingWhitelist: React.FC = () => {
  const { control } = useForm<ExistingWhitelistDetailsFormValues>({
    defaultValues: {
      whitelistAddress: "",
    },
    mode: "onBlur",
  });

  return (
    <View
      style={{
        maxWidth: 416,
      }}
    >
      <SpacerColumn size={2} />

      <TextInputLaunchpadRequired<ExistingWhitelistDetailsFormValues>
        label="Whitelist Address"
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="whitelistAddress"
        control={control}
      />
    </View>
  );
};
