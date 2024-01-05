import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
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
      <TextInputCustom<ExistingWhitelistDetailsFormValues>
        rules={{ required: true }}
        label="Whitelist Address"
        placeHolder="teritori123456789qwertyuiopasdfghjklzxcvbnm"
        name="whitelistAddress"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
    </View>
  );
};
