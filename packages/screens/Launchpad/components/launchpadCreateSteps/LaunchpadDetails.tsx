import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CreateCollectionFormValues } from "../../CreateCollection.type";
import { TextInputLaunchpadRequired } from "../inputs/TextInputLaunchpadRequired";
import { MultipleSelectInput } from "../inputs/selectInputs/MultipleSelectInput";
import { SelectInputLaunchpad } from "../inputs/selectInputs/SelectInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadDetails: React.FC<{
  createCollectionForm: UseFormReturn<CreateCollectionFormValues>;
}> = ({ createCollectionForm }) => {
  const isDerivativeProject = createCollectionForm.watch("isDerivativeProject");
  const isPreviouslyApplied = createCollectionForm.watch("isPreviouslyApplied");
  const projectTypes = createCollectionForm.watch("projectTypes") || [];

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Collection details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Information about your collection
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          label="Website Link"
          placeHolder="https://website..."
          name="websiteLink"
          control={createCollectionForm.control}
          required={false}
        />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          required
          label="Twitter Profile "
          placeHolder="https://twitter..."
          name="twitterProfileUrl"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          required
          label="How many Twitter followers does your project have? "
          placeHolder="10,000"
          name="nbTwitterFollowers"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          required
          label="Discord name of your main contact: "
          placeHolder="nickname#0000"
          name="discordName"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          required
          label="Main contact email address: "
          placeHolder="contact@email.com"
          name="email"
          control={createCollectionForm.control}
        />

        <SelectInputLaunchpad
          dropdownOptions={["Yes", "No"]}
          placeHolder="Select Option"
          item={
            isDerivativeProject === true
              ? "Yes"
              : isDerivativeProject === false
                ? "No"
                : ""
          }
          setItem={(item) => {
            createCollectionForm.setValue(
              "isDerivativeProject",
              item === "Yes",
            );
          }}
          label="Is your project a derivative project?"
          style={{ zIndex: 3 }}
        />

        <MultipleSelectInput
          dropdownOptions={["PFP", "Utility", "Metaverse", "P2E", "Other"]}
          placeHolder="Select Option"
          items={projectTypes}
          setItems={(item) => {
            const selectedProjectTypes = projectTypes.includes(item)
              ? projectTypes.filter((data) => data !== item)
              : [...projectTypes, item];
            createCollectionForm.setValue("projectTypes", selectedProjectTypes);
          }}
          label="Project type:"
          sublabel={
            <View style={{ marginBottom: layout.spacing_x1 }}>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Multiple answers allowed
              </BrandText>
            </View>
          }
          style={{ zIndex: 2 }}
        />

        <TextInputLaunchpadRequired<CreateCollectionFormValues>
          label="Describe your project: "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                1. What's your concept?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                2. How is it different?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                3. What's your goal?
              </BrandText>
            </View>
          }
          placeHolder="Describe here..."
          name="projectDescription"
          control={createCollectionForm.control}
        />

        <SelectInputLaunchpad
          dropdownOptions={["Yes", "No"]}
          placeHolder="Select Option"
          item={
            isPreviouslyApplied === true
              ? "Yes"
              : isPreviouslyApplied === false
                ? "No"
                : ""
          }
          setItem={(item) => {
            createCollectionForm.setValue(
              "isPreviouslyApplied",
              item === "Yes",
            );
          }}
          label="Have you previously applied for the same project before?"
          style={{ zIndex: 1 }}
        />
      </View>
    </View>
  );
};
