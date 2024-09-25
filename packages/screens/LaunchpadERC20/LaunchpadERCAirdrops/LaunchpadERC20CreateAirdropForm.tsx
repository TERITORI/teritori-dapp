import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { LaunchpadERC20CreateAirdropFooter } from "./LaunchpadERC20CreateAirdropFooter";
import { useCreateAirdropState } from "../hooks/useCreateAirdrop";
import { TCreateAirdropForm, zodCreateAirdropForm } from "../utils/forms";

import { BrandText } from "@/components/BrandText";
import { CsvTextRowsInput } from "@/components/inputs/CsvTextRowsInput";
import { DateTimeInput } from "@/components/inputs/DateTimeInput";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { computeMerkleRoot } from "@/utils/merkle";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const CreateAirdropForm: React.FC = () => {
  const [whitelistedAddresses, setWhitelistedAddresses] = useState<string[]>();
  const {
    actions: { goNextStep, setAirdrop },
    createAirdropForm: formData,
  } = useCreateAirdropState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const { handleSubmit, setValue, watch, control, getFieldState } =
    useForm<TCreateAirdropForm>({
      resolver: zodResolver(zodCreateAirdropForm),
      defaultValues: formData,
      mode: "all",
    });

  useEffect(() => {
    if (!caller) {
      // TODO: would be better to not allow this corner case, aka do something smarter when no wallet is connected
      return;
    }
    setValue("caller", caller);
  }, [setValue, caller]);

  if (!caller) {
    return <BrandText>Connect a wallet to create an airdrop</BrandText>;
  }

  const values = watch();
  const startTimestamp = watch("startTimestamp");
  const endTimestamp = watch("endTimestamp");
  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Airdrop Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Airdrop
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateAirdropForm>
        label="Token Name (The token have to be mintable and owned by the caller)"
        name="tokenName"
        fullWidth
        placeholder="Type the token name here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Whitelisted addresses *
      </BrandText>

      <SpacerColumn size={1.5} />

      <CsvTextRowsInput
        rows={whitelistedAddresses}
        onUpload={(_, rows) => {
          setWhitelistedAddresses(rows);
          setValue("merkleRoot", computeMerkleRoot(rows));
        }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Amount of tokens to give per user"
        name="amountPerAddr"
        fullWidth
        placeholder="Type the amount of tokens to give per user here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <Controller<TCreateAirdropForm>
        name="startTimestamp"
        control={control}
        render={({ field: { onChange } }) => (
          <DateTimeInput
            label="Start date"
            required={false}
            onChange={onChange}
            timestamp={startTimestamp || 0}
            isDirty={getFieldState("startTimestamp").isDirty}
          />
        )}
      />

      <SpacerColumn size={2.5} />

      <Controller<TCreateAirdropForm>
        name="endTimestamp"
        control={control}
        render={({ field: { onChange } }) => (
          <DateTimeInput
            label="End date"
            required={false}
            onChange={onChange}
            timestamp={endTimestamp || 0}
            isDirty={getFieldState("endTimestamp").isDirty}
          />
        )}
      />

      <SpacerColumn size={2.5} />

      <LaunchpadERC20CreateAirdropFooter
        disableNext={
          !values.tokenName || !values.merkleRoot || !values.amountPerAddr
        }
        onSubmit={handleSubmit((submitValues) => {
          setAirdrop(submitValues);
          goNextStep();
        })}
        nextText="Create this Airdrop"
      />
    </View>
  );
};
