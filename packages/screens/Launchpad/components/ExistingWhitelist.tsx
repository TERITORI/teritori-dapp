import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadExistingWhitelistValues } from "./inputs/TextInputLaunchpadExistingWhitelistValues";
import { SpacerColumn } from "../../../components/spacer";
import { ExistingWhitelistDetailsFormValues } from "../CreateCollection.type";

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

      <TextInputLaunchpadExistingWhitelistValues
        label="Whitelist Address"
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="whitelistAddress"
        control={control}
      />
    </View>
  );
};
