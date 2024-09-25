import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { LaunchpadERC20CreateTokenFooter } from "./LaunchpadERC20CreateTokenFooter";
import { useCreateTokenState } from "../hooks/useCreateToken";
import {
  TCreateTokenFormDetails,
  zodCreateTokenFormDetails,
} from "../utils/forms";

import { BrandText } from "@/components/BrandText";
import ToggleButton from "@/components/buttons/ToggleButton";
import { Label } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const CreateTokenDetails: React.FC = () => {
  const {
    actions: { setDetails, goNextStep },
    createTokenFormDetails: detailsData,
  } = useCreateTokenState();
  const { handleSubmit, watch, setValue } = useForm<TCreateTokenFormDetails>({
    resolver: zodResolver(zodCreateTokenFormDetails),
    defaultValues: detailsData,
  });
  const values = watch();

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Token Details Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Details Informations about your Token
      </BrandText>

      <SpacerColumn size={2.5} />

      <Label>Can Mint</Label>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Allow the minting of tokens
      </BrandText>

      <SpacerColumn size={1.5} />

      <TouchableOpacity
        onPress={() => setValue("allowMint", !values.allowMint)}
      >
        <ToggleButton value={values.allowMint} isActive />
      </TouchableOpacity>

      <SpacerColumn size={2.5} />

      <Label>Can Burn</Label>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Allow the burning of tokens
      </BrandText>

      <SpacerColumn size={1.5} />
      <TouchableOpacity
        onPress={() => setValue("allowBurn", !values.allowBurn)}
      >
        <ToggleButton value={values.allowBurn} isActive />
      </TouchableOpacity>

      <SpacerColumn size={2.5} />

      <LaunchpadERC20CreateTokenFooter
        disableNext={false}
        onSubmit={handleSubmit((submitValues) => {
          setDetails(submitValues);
          goNextStep();
        })}
        nextText="Create this Token"
      />
    </View>
  );
};
