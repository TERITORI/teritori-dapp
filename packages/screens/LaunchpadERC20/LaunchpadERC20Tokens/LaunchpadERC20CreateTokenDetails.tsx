import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { LaunchpadERC20CreateTokenFooter } from "./LaunchpadERC20CreateTokenFooter";
import {
  useCreateTokenState,
  zodCreateTokenFormDetails,
} from "../hooks/useCreateToken";

import { BrandText } from "@/components/BrandText";
import ToggleButton from "@/components/buttons/ToggleButton";
import { SpacerColumn } from "@/components/spacer";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const CreateTokenDetails: React.FC = () => {
  const {
    actions: { setDetails },
    createTokenFormDetails: detailsData,
  } = useCreateTokenState();
  const { handleSubmit, formState, watch } = useForm({
    resolver: zodResolver(zodCreateTokenFormDetails),
    defaultValues: detailsData,
  });
  const { errors } = formState;
  const values = watch();

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Token Details Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Details Informations about your Token
      </BrandText>

      <SpacerColumn size={2.5} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Can Mint
      </BrandText>

      <ToggleButton value={values.allowMint} />

      <SpacerColumn size={2.5} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Can Burn
      </BrandText>

      <ToggleButton value={values.allowBurn} />

      <SpacerColumn size={2.5} />

      <LaunchpadERC20CreateTokenFooter
        disableNext={Object.keys(errors).length !== 0}
        onSubmit={handleSubmit((submitValues) => {
          setDetails(submitValues);
        })}
        nextText="Create Token"
      />
    </View>
  );
};
