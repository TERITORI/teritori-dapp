import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../CreateCollection.type";
import { TextInputLaunchpadRequired } from "../inputs/TextInputLaunchpadRequired";
import { SelectInputLaunchpad } from "../inputs/selectInputs/SelectInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const LaunchpadAdditional: React.FC<{
  createCollectionForm: UseFormReturn<CollectionFormValues>;
}> = ({ createCollectionForm }) => {
  const isReadyForMint = createCollectionForm.watch("isReadyForMint");
  const escrowMintProceedsPeriod = createCollectionForm.watch(
    "escrowMintProceedsPeriod",
  );
  const isDox = createCollectionForm.watch("isDox");

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Additional Information</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Fill the additional information
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Please describe your artworkDescription: "
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
          name="artworkDescription"
          control={createCollectionForm.control}
          multiline
        />

        <SelectInputLaunchpad
          dropdownOptions={["Yes", "No"]}
          placeHolder="Select Option"
          item={
            isReadyForMint === true
              ? "Yes"
              : isReadyForMint === false
                ? "No"
                : ""
          }
          setItem={(item) => {
            createCollectionForm.setValue("isReadyForMint", item === "Yes");
          }}
          label="Is your collection ready for the mint?"
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="What is your expected collection supply?"
          placeHolder="Type here..."
          name="expectedSupply"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="What is your expected public sale mint price?"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Just type the number in your Network currency:
              </BrandText>
            </View>
          }
          placeHolder="0"
          name="expectedPublicMintPrice"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="What is your expected mint date? "
          placeHolder="dd.mm.yyyy | hh:mm PM"
          name="expectedMintDate"
          control={createCollectionForm.control}
        />

        <SelectInputLaunchpad
          dropdownOptions={["1", "2", "3"]}
          placeHolder="Select Option"
          item={escrowMintProceedsPeriod?.toString()}
          setItem={(item) => {
            createCollectionForm.setValue(
              "escrowMintProceedsPeriod",
              parseInt(item, 10),
            );
          }}
          label="If selected for the launchpad, You will escrow mint proceeds for this time period:"
          style={{ zIndex: 2 }}
        />

        <SelectInputLaunchpad
          dropdownOptions={["Yes", "No"]}
          placeHolder="Select Option"
          item={isDox === true ? "Yes" : isDox === false ? "No" : ""}
          setItem={(item) => {
            createCollectionForm.setValue("isDox", item === "Yes");
          }}
          label="Are you dox or have you planned to dox?"
          style={{ zIndex: 1 }}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="We'd love to offer TeritoriDAO members 10% of your whitelist supply if your project is willing. Please let us know how many whitelist spots you'd be willing to allocate our DAO: "
          placeHolder="0"
          name="daoWhitelistCount"
          control={createCollectionForm.control}
        />
      </View>
    </View>
  );
};
