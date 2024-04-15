import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../../utils/types/launchpad";
import { MultipleSelectInput } from "../inputs/selectInputs/MultipleSelectInput";
import { SelectInputLaunchpad } from "../inputs/selectInputs/SelectInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import {
  patternOnlyEmail,
  patternOnlyNumbers,
  patternOnlyUrl,
} from "@/utils/formRules";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const LaunchpadDetails: React.FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const projectTypes = collectionForm.watch("projectTypes") || [];

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Collection details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Information about your collection
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Website Link"
          placeHolder="https://website..."
          name="websiteLink"
          control={collectionForm.control}
          rules={{ required: false, pattern: patternOnlyUrl }}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Twitter Profile "
          placeHolder="https://twitter..."
          name="twitterProfileUrl"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyUrl }}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="How many Twitter followers does your project have? "
          placeHolder="10,000"
          name="nbTwitterFollowers"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyNumbers }}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Discord name of your main contact: "
          placeHolder="nickname#0000"
          name="discordName"
          control={collectionForm.control}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Main contact email address: "
          placeHolder="contact@email.com"
          name="email"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyEmail }}
        />

        <Controller<CollectionFormValues>
          name="isDerivativeProject"
          control={collectionForm.control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <SelectInputLaunchpad
              dropdownOptions={["Yes", "No"]}
              placeHolder="Select Option"
              item={value === true ? "Yes" : value === false ? "No" : ""}
              onPressItem={(item) => {
                onChange(() => item === "Yes");
              }}
              label="Is your project a derivative project?"
              style={{ zIndex: 3 }}
            />
          )}
        />

        <Controller<CollectionFormValues>
          name="projectTypes"
          control={collectionForm.control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange } }) => (
            <MultipleSelectInput
              dropdownOptions={["PFP", "Utility", "Metaverse", "P2E", "Other"]}
              placeHolder="Select Option"
              items={projectTypes}
              onPressItem={(item) => {
                const selectedProjectTypes = projectTypes.includes(item)
                  ? projectTypes.filter((data) => data !== item)
                  : [...projectTypes, item];
                onChange(() => selectedProjectTypes);
              }}
              label="Project type:"
              sublabel={
                <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                  Multiple answers allowed
                </BrandText>
              }
              style={{ zIndex: 2 }}
            />
          )}
        />

        <TextInputLaunchpad<CollectionFormValues>
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
          control={collectionForm.control}
        />

        <Controller<CollectionFormValues>
          name="isPreviouslyApplied"
          control={collectionForm.control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <SelectInputLaunchpad
              dropdownOptions={["Yes", "No"]}
              placeHolder="Select Option"
              item={value === true ? "Yes" : value === false ? "No" : ""}
              onPressItem={(item) => {
                onChange(() => item === "Yes");
              }}
              label="Have you previously applied for the same project before?"
              style={{ zIndex: 1 }}
            />
          )}
        />
      </View>
    </View>
  );
};
