import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { LaunchpadERC20CreateSaleFooter } from "./LaunchpadERC20CreateSaleFooter";
import { useCreateSaleState, zodCreateSaleForm } from "../hooks/useCreateSale";

import { BrandText } from "@/components/BrandText";
import ToggleButton from "@/components/buttons/ToggleButton";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

// TODO: ADD A WAY TO JUST DROP A CSV FILE OR ENTER A LIST OF ADDR AND IT WILL COMPUTE THE MERKLE ROOT FOR YOU
// TODO: ADD A DATE PICKER FOR THE START TIMESTAMP AND END TIMESTAMP
export const CreateSaleForm: React.FC = () => {
  const {
    actions: { goNextStep, setSale },
    createSaleForm: formData,
  } = useCreateSaleState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const { handleSubmit, formState, setValue, watch } = useForm({
    resolver: zodResolver(zodCreateSaleForm),
    defaultValues: formData,
  });

  const { errors } = formState;
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
  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Sale Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Sale
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Token Name * (The token have to be owned by the caller)"
        name="name"
        fullWidth
        placeholder="Type the token name here..."
        variant="labelOutside"
        onChangeText={(text) => setValue("tokenName", text)}
        value={values.tokenName}
        error={errors.tokenName?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Price per unit of token * ($GNOT)"
        name="pricePerToken"
        fullWidth
        placeholder="Type the price per token here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("pricePerToken", Number(val))}
        value={values.pricePerToken.toString()}
        error={errors.pricePerToken?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Limit of tokens a user can buy*"
        name="amountPerAddr"
        fullWidth
        placeholder="Type the limit of tokens a user can buy here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("limitPerAddr", Number(val))}
        value={values.limitPerAddr.toString()}
        error={errors.limitPerAddr?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Minimum Goal * (The sale will refund buyers if this goal is reach)"
        name="startTimestamp"
        fullWidth
        placeholder="Type the minimum goal here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("minGoal", Number(val))}
        value={values.minGoal?.toString()}
        error={errors.minGoal?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Maximum Goal * (The sale will stop if this goal is reach)"
        name="endTimestamp"
        fullWidth
        placeholder="Type the maximum goal here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("maxGoal", Number(val))}
        value={values.maxGoal?.toString()}
        error={errors.maxGoal?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Unix Start Timestamp * (have to be in the future)"
        name="startTimestamp"
        fullWidth
        placeholder="Type the unix start timestamp here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("startTimestamp", Number(val))}
        value={values.startTimestamp?.toString()}
        error={errors.startTimestamp?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Unix End Timestamp * (have to be greater than start)"
        name="endTimestamp"
        fullWidth
        placeholder="Type the unix end timestamp here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("endTimestamp", Number(val))}
        value={values.endTimestamp?.toString()}
        error={errors.endTimestamp?.message}
      />

      <SpacerColumn size={2.5} />
      <TextInputCustom
        label="Merkle Root (Optional, if you want to whitelist addresses)"
        name="merkleRoot"
        fullWidth
        placeholder="Type the merkle root here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("merkleRoot", val)}
        value={values.merkleRoot}
        error={errors.merkleRoot?.message}
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
