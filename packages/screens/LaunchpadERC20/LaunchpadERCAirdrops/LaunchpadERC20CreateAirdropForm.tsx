import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { LaunchpadERC20CreateAirdropFooter } from "./LaunchpadERC20CreateAirdropFooter";
import { useCreateAirdropState } from "../hooks/useCreateAirdrop";
import { zodCreateAirdropForm } from "../utils/forms";

import { BrandText } from "@/components/BrandText";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

// TODO: ADD A WAY TO JUST DROP A CSV FILE OR ENTER A LIST OF ADDR AND IT WILL COMPUTE THE MERKLE ROOT FOR YOU
// TODO: ADD A DATE PICKER FOR THE START TIMESTAMP AND END TIMESTAMP
export const CreateAirdropForm: React.FC = () => {
  const {
    actions: { goNextStep, setAirdrop },
    createAirdropForm: formData,
  } = useCreateAirdropState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const { handleSubmit, formState, setValue, watch } = useForm({
    resolver: zodResolver(zodCreateAirdropForm),
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
    return <BrandText>Connect a wallet to create an airdrop</BrandText>;
  }

  const values = watch();
  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Airdrop Informations</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Airdrop
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Token Name * (The token have to be mintable and owned by the caller)"
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
        label="Merkle Root *"
        name="merkleRoot"
        fullWidth
        placeholder="Type the merkle root here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("merkleRoot", val)}
        value={values.merkleRoot}
        error={errors.merkleRoot?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Amount of tokens to give per user *"
        name="amountPerAddr"
        fullWidth
        placeholder="Type the amount of tokens to give per user here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("amountPerAddr", Number(val))}
        value={values.amountPerAddr.toString()}
        error={errors.amountPerAddr?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Unix Start Timestamp"
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
        label="Unix End Timestamp"
        name="endTimestamp"
        fullWidth
        placeholder="Type the unix end timestamp here..."
        variant="labelOutside"
        onChangeText={(val) => setValue("endTimestamp", Number(val))}
        value={values.endTimestamp?.toString()}
        error={errors.endTimestamp?.message}
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
