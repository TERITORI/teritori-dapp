import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { LaunchpadERC20CreateTokenFooter } from "./LaunchpadERC20CreateTokenFooter";
import { useCreateTokenState } from "../hooks/useCreateToken";
import {
  TCreateTokenFormBasics,
  zodCreateTokenFormBasics,
} from "../utils/forms";

import { BrandText } from "@/components/BrandText";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const CreateTokenBasics: React.FC = () => {
  const {
    actions: { goNextStep, setBasics },
    createTokenFormBasics: basicsData,
  } = useCreateTokenState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const { handleSubmit, setValue, watch, control } =
    useForm<TCreateTokenFormBasics>({
      resolver: zodResolver(zodCreateTokenFormBasics),
      defaultValues: basicsData,
      mode: "all",
    });

  const values = watch();
  if (!caller) {
    return <BrandText>Connect a wallet to create a token</BrandText>;
  }

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Token Basics Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Token
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateTokenFormBasics>
        label="Token Name"
        name="name"
        fullWidth
        placeholder="Type the token name here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateTokenFormBasics>
        label="Token Symbol"
        name="symbol"
        fullWidth
        placeholder="Type the token symbol here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateTokenFormBasics>
        label="Token Decimals"
        name="decimals"
        fullWidth
        placeholder="Type the token decimals here... (0-18)"
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateTokenFormBasics>
        label="Total Supply"
        name="totalSupply"
        fullWidth
        placeholder="Type the total supply here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateTokenFormBasics>
        label="Total Supply Cap"
        name="totalSupplyCap"
        fullWidth
        placeholder="Type the total supply cap here..."
        variant="labelOutside"
        control={control}
      />

      <SpacerColumn size={2.5} />

      <LaunchpadERC20CreateTokenFooter
        disableNext={!values.name || !values.symbol || !values.totalSupply}
        onSubmit={() => {
          setValue("caller", caller);
          handleSubmit((submitValues) => {
            setBasics(submitValues);
            goNextStep();
          })();
        }}
      />
    </View>
  );
};
