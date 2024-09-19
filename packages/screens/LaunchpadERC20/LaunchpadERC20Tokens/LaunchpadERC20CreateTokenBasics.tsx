import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { LaunchpadERC20CreateTokenFooter } from "./LaunchpadERC20CreateTokenFooter";
import {
  useCreateTokenState,
  zodCreateTokenFormBasics,
} from "../hooks/useCreateToken";

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
  const { handleSubmit, formState, setValue, watch } = useForm({
    resolver: zodResolver(zodCreateTokenFormBasics),
    defaultValues: basicsData,
  });
  const { errors } = formState;
  const values = watch();
  useEffect(() => {
    if (!caller) {
      // TODO: would be better to not allow this corner case, aka do something smarter when no wallet is connected
      return;
    }
    setValue("caller", caller);
  }, [setValue, caller]);

  if (!caller) {
    return null;
  }

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Token Basics Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Token
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Token Name *"
        name="name"
        fullWidth
        placeholder="Type the token name here..."
        variant="labelOutside"
        onChangeText={(text) => setValue("name", text)}
        value={values.name}
        error={errors.name?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Token Symbol *"
        name="symbol"
        fullWidth
        placeholder="Type the token symbol here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("symbol", val)}
        value={values.name}
        error={errors.name?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Token Decimals *"
        name="decimals"
        fullWidth
        placeholder="Type the token decimals here... (0-18)"
        variant="labelOutside"
        onChangeText={(val) => setValue("decimals", Number(val))}
        value={values.decimals.toString()}
        error={errors.decimals?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Total Supply *"
        name="totalSupply"
        fullWidth
        placeholder="Type the total supply here..."
        textInputStyle={{ height: 80 }}
        variant="labelOutside"
        onChangeText={(val) => setValue("totalSupply", val)}
        value={values.totalSupply}
        error={errors.totalSupply?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Total Supply Cap *"
        name="totalSupplyCap"
        fullWidth
        placeholder="Type the total supply cap here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("totalSupplyCap", val)}
        value={values.totalSupplyCap}
        error={errors.totalSupplyCap?.message}
      />

      <SpacerColumn size={2.5} />

      <LaunchpadERC20CreateTokenFooter
        disableNext={Object.keys(errors).length !== 0}
        onSubmit={handleSubmit((submitValues) => {
          setBasics(submitValues);
          goNextStep();
        })}
      />
    </View>
  );
};
