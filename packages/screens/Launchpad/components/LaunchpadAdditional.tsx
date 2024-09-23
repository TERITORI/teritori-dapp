import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { SelectionDropdown } from "./dropdowns/SelectionDropdown";
import { TextInputLaunchpadRequired } from "./inputs/TextInputLaunchpadRequired";
import { TextInputLaunchpadRequiredSublabel } from "./inputs/TextInputLaunchpadRequiredSublabel";
import { NewCollectionAdditionalFormValues } from "../CreateCollection.type";

import { BrandText } from "@/components/BrandText";
import { DateTimeInput } from "@/components/inputs/DateTimeInput";
import { SpacerColumn } from "@/components/spacer";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const LaunchpadAdditional: React.FC = () => {
  const dropdownOptions = ["Yes", "No"];

  const [isReadyForMint, setIsReadyForMint] = useState("");
  const [isEscrowMintProceeds, setIsEscrowMintProceeds] = useState("");
  const [isDox, setIsDox] = useState("");

  const { control, getFieldState, watch } =
    useForm<NewCollectionAdditionalFormValues>({
      defaultValues: {
        artwork: "",
        collectionSupply: "",
        mintPrice: "",
        mintDate: "",
        whitelistSpotPercentage: "",
      },
      mode: "onBlur",
    });
  const mintDate = watch("mintDate");

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Additional Information</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Fill the additional information
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpadRequiredSublabel<NewCollectionAdditionalFormValues>
          label="Please describe your artwork: "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                1. Is it completely original?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                2. Who is the artist?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                3. How did your team meet the artist?
              </BrandText>
            </View>
          }
          placeHolder="Describe here..."
          name="artwork"
          control={control}
          multiline
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={isReadyForMint}
          setItem={setIsReadyForMint}
          label="Is your collection ready for the mint?"
        />

        <TextInputLaunchpadRequired<NewCollectionAdditionalFormValues>
          label="What is your expected collection supply?"
          placeHolder="Type here..."
          name="collectionSupply"
          control={control}
        />

        <TextInputLaunchpadRequiredSublabel<NewCollectionAdditionalFormValues>
          label="What is your expected public sale mint price?"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Just type the number in your Network currency:
              </BrandText>
            </View>
          }
          placeHolder="0"
          name="mintPrice"
          control={control}
        />

        <TextInputLaunchpadRequired<NewCollectionAdditionalFormValues>
          label="What is your expected mint date? "
          placeHolder="dd.mm.yyyy | hh:mm PM"
          name="mintDate"
          control={control}
        />

        <Controller<NewCollectionAdditionalFormValues>
          name="mintDate"
          control={control}
          render={({ field: { onChange } }) => (
            <DateTimeInput
              label="What is your expected mint date?"
              onChange={onChange}
              timestamp={mintDate ? parseInt(mintDate, 10) : undefined}
              isDirty={getFieldState("mintDate").isDirty}
            />
          )}
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={isEscrowMintProceeds}
          setItem={setIsEscrowMintProceeds}
          label="If selected for the launchpad, You will escrow mint proceeds for this time period: *"
          style={{ zIndex: 2 }}
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={isDox}
          setItem={setIsDox}
          label="Are you dox or have you planned to dox?"
          style={{ zIndex: 1 }}
        />

        <TextInputLaunchpadRequired<NewCollectionAdditionalFormValues>
          label="We'd love to offer TeritoriDAO members 10% of your whitelist supply if your project is willing. Please let us know how many whitelist spots you'd be willing to allocate our DAO: "
          placeHolder="0"
          name="whitelistSpotPercentage"
          control={control}
        />
      </View>
    </View>
  );
};
