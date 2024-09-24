import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { LaunchpadERC20CreateSaleFooter } from "./LaunchpadERC20CreateSaleFooter";
import { useCreateSaleState } from "../hooks/useCreateSale";
import { TCreateSaleForm, zodCreateSaleForm } from "../utils/forms";

import { BrandText } from "@/components/BrandText";
import ToggleButton from "@/components/buttons/ToggleButton";
import { CsvTextRowsInput } from "@/components/inputs/CsvTextRowsInput";
import { DateTimeInput } from "@/components/inputs/DateTimeInput";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { computeMerkleRoot } from "@/utils/merkle";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

// TODO: ADD A WAY TO JUST DROP A CSV FILE OR ENTER A LIST OF ADDR AND IT WILL COMPUTE THE MERKLE ROOT FOR YOU
// TODO: ADD A DATE PICKER FOR THE START TIMESTAMP AND END TIMESTAMP
export const CreateSaleForm: React.FC = () => {
  const [whitelistedAddresses, setWhitelistedAddresses] = useState<string[]>();
  const {
    actions: { goNextStep, setSale },
    createSaleForm: formData,
  } = useCreateSaleState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const { handleSubmit, setValue, watch, control, getFieldState } =
    useForm<TCreateSaleForm>({
      resolver: zodResolver(zodCreateSaleForm),
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
    return <BrandText>Connect a wallet to create a sale</BrandText>;
  }

  const values = watch();
  const startTimestamp = watch("startTimestamp");
  const endTimestamp = watch("endTimestamp");
  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Sale Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Sale
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateSaleForm>
        label="Token Name (The token have to be owned by the caller)"
        name="tokenName"
        fullWidth
        placeholder="Type the token name here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateSaleForm>
        label="Price per unit of token ($GNOT)"
        name="pricePerToken"
        fullWidth
        placeholder="Type the price per token here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateSaleForm>
        label="Limit of tokens a user can buy"
        name="limitPerAddr"
        fullWidth
        placeholder="Type the limit of tokens a user can buy here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom<TCreateSaleForm>
        label="Minimum Goal (The sale will refund buyers if this goal is reach)"
        name="minGoal"
        fullWidth
        placeholder="Type the minimum goal here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Maximum Goal (The sale will stop if this goal is reach)"
        name="maxGoal"
        fullWidth
        placeholder="Type the maximum goal here..."
        variant="labelOutside"
        control={control}
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />

      <Controller<TCreateSaleForm>
        name="startTimestamp"
        control={control}
        render={({ field: { onChange } }) => (
          <DateTimeInput
            label="Start date"
            onChange={onChange}
            timestamp={startTimestamp}
            isDirty={getFieldState("startTimestamp").isDirty}
          />
        )}
      />

      <SpacerColumn size={2.5} />

      <Controller<TCreateSaleForm>
        name="endTimestamp"
        control={control}
        render={({ field: { onChange } }) => (
          <DateTimeInput
            label="End date"
            onChange={onChange}
            timestamp={endTimestamp}
            isDirty={getFieldState("endTimestamp").isDirty}
          />
        )}
      />
      <SpacerColumn size={2.5} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Whitelisted addresses (Optional)
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

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Mint Tokens (Token have to be mintable to allow this feature)
      </BrandText>

      <SpacerColumn size={1} />

      <TouchableOpacity onPress={() => setValue("minted", !values.minted)}>
        <ToggleButton value={values.minted} isActive />
      </TouchableOpacity>

      <SpacerColumn size={2.5} />

      <LaunchpadERC20CreateSaleFooter
        disableNext={
          !values.tokenName ||
          !values.startTimestamp ||
          !values.endTimestamp ||
          !values.limitPerAddr ||
          !values.pricePerToken ||
          !values.minGoal ||
          !values.maxGoal
        }
        onSubmit={handleSubmit((submitValues) => {
          setSale(submitValues);
          goNextStep();
        })}
        nextText="Create this Sale"
      />
    </View>
  );
};
