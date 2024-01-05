import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SelectionDropdown } from "../../../components/SelectionDropdown";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00, neutral55, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewCollectionAdditionalFormValues } from "../CreateCollection.type";

export const LaunchpadAdditional: React.FC = () => {
  const dropdownOptions = ["Yes", "No"];

  const [item, setItem] = useState("");

  const { control } = useForm<NewCollectionAdditionalFormValues>({
    defaultValues: {
      artwork: "",
      collectionSupply: "",
      mintPrice: "",
      mintDate: "",
      whitelistSpotPercentage: "",
    },
    mode: "onBlur",
  });

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Additional Information</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Fill the additional information
        </BrandText>
        <SpacerColumn size={2} />
        <TextInputCustom<NewCollectionAdditionalFormValues>
          rules={{ required: true }}
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
          variant="labelOutside"
          multiline
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={item}
          setItem={setItem}
          label="Is your collection ready for the mint? *"
        />

        <TextInputCustom<NewCollectionAdditionalFormValues>
          rules={{ required: true }}
          label="What is your expected collection supply?"
          placeHolder="Type here..."
          name="collectionSupply"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <TextInputCustom<NewCollectionAdditionalFormValues>
          rules={{ required: true }}
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
          variant="labelOutside"
          multiline
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <TextInputCustom<NewCollectionAdditionalFormValues>
          rules={{ required: true }}
          label="What is your expected mint date? "
          placeHolder="dd.mm.yyyy | hh:mm PM"
          name="mintDate"
          control={control}
          variant="labelOutside"
          multiline
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={item}
          setItem={setItem}
          label="If selected for the launchpad, You will escrow mint proceeds for this time period: *"
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={item}
          setItem={setItem}
          label="Are you dox or have you planned to dox? *"
        />

        <TextInputCustom<NewCollectionAdditionalFormValues>
          rules={{ required: true }}
          label="We'd love to offer TeritoriDAO members 10% of your whitelist supply if your project is willing. Please let us know how many whitelist spots you'd be willing to allocate our DAO: "
          placeHolder="0"
          name="whitelistSpotPercentage"
          control={control}
          variant="labelOutside"
          multiline
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
          labelStyle={{ maxWidth: 416 }}
        />
      </View>
    </View>
  );
};
