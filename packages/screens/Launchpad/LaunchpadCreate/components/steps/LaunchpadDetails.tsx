import React, { Dispatch, FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../../../utils/types/launchpad";
import { MultipleSelectInput } from "../../../components/inputs/selectInputs/MultipleSelectInput";
import { SelectInputLaunchpad } from "../../../components/inputs/selectInputs/SelectInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { SpacerColumn } from "@/components/spacer";
import {
  LaunchpadCreateStep,
  LaunchpadCreateStepKey,
  LaunchpadStepper,
} from "@/screens/Launchpad/LaunchpadCreate/components/LaunchpadStepper";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const LaunchpadDetails: FC<{
  steps: LaunchpadCreateStep[];
  setSelectedStepKey: Dispatch<React.SetStateAction<LaunchpadCreateStepKey>>;
}> = ({ steps, setSelectedStepKey }) => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const projectTypes = collectionForm.watch("projectTypes") || [];
  const isDerivativeProject = collectionForm.watch("isDerivativeProject");
  const isPreviouslyApplied = collectionForm.watch("isPreviouslyApplied");

  return (
    <>
      <LaunchpadStepper
        steps={steps}
        selectedStepKey={2}
        setSelectedStepKey={setSelectedStepKey}
      />
      <SpacerColumn size={4} />

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{ maxWidth: 416, width: "100%" }}>
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
            form={collectionForm}
            required={false}
          />

          <TextInputLaunchpad<CollectionFormValues>
            label="Twitter Profile "
            placeHolder="https://twitter..."
            name="twitterProfileUrl"
            form={collectionForm}
          />

          <TextInputLaunchpad<CollectionFormValues>
            label="How many Twitter followers does your project have? "
            placeHolder="10,000"
            name="nbTwitterFollowers"
            form={collectionForm}
          />

          <TextInputLaunchpad<CollectionFormValues>
            label="Discord name of your main contact: "
            placeHolder="nickname#0000"
            name="discordName"
            form={collectionForm}
          />

          <TextInputLaunchpad<CollectionFormValues>
            label="Main contact email address: "
            placeHolder="contact@email.com"
            name="email"
            form={collectionForm}
          />

          <Controller<CollectionFormValues>
            name="isDerivativeProject"
            control={collectionForm.control}
            render={({ field: { onChange } }) => (
              <>
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
                  onPressItem={(item) => {
                    onChange(item === "Yes");
                  }}
                  label="Is your project a derivative project?"
                  style={{ zIndex: 3 }}
                />
                <ErrorText>
                  {
                    collectionForm.getFieldState("isDerivativeProject").error
                      ?.message
                  }
                </ErrorText>
              </>
            )}
          />
          <SpacerColumn size={2} />

          <Controller<CollectionFormValues>
            name="projectTypes"
            control={collectionForm.control}
            render={({ field: { onChange } }) => (
              <>
                <MultipleSelectInput
                  dropdownOptions={[
                    "PFP",
                    "Utility",
                    "Metaverse",
                    "P2E",
                    "Other",
                  ]}
                  placeHolder="Select Option"
                  items={projectTypes}
                  onPressItem={(item) => {
                    const selectedProjectTypes = projectTypes.includes(item)
                      ? projectTypes.filter((data) => data !== item)
                      : [...projectTypes, item];
                    onChange(selectedProjectTypes);
                  }}
                  label="Project type:"
                  sublabel={
                    <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                      Multiple answers allowed
                    </BrandText>
                  }
                  style={{ zIndex: 2 }}
                />
                <ErrorText>
                  {collectionForm.getFieldState("projectTypes").error?.message}
                </ErrorText>
              </>
            )}
          />
          <SpacerColumn size={2} />

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
            form={collectionForm}
          />

          <Controller<CollectionFormValues>
            name="isPreviouslyApplied"
            control={collectionForm.control}
            render={({ field: { onChange } }) => (
              <>
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
                  onPressItem={(item) => {
                    onChange(item === "Yes");
                  }}
                  label="Have you previously applied for the same project before?"
                  style={{ zIndex: 1 }}
                />
                <ErrorText>
                  {
                    collectionForm.getFieldState("isPreviouslyApplied").error
                      ?.message
                  }
                </ErrorText>
              </>
            )}
          />
          <SpacerColumn size={2} />
        </View>
      </View>
    </>
  );
};
