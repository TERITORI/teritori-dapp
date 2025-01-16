import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { MultipleSelectInput } from "../../../components/inputs/selectInputs/MultipleSelectInput";
import { SelectInputLaunchpad } from "../../../components/inputs/selectInputs/SelectInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { SpacerColumn } from "@/components/spacer";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import { fontMedium13, fontMedium14, fontMedium20 } from "@/utils/style/fonts";
import { CollectionFormValues } from "@/utils/types/launchpad";

export const LaunchpadDetails: FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const projectTypes = collectionForm.watch("projectTypes") || [];
  const isDerivativeProject = collectionForm.watch("isDerivativeProject");
  const isPreviouslyApplied = collectionForm.watch("isPreviouslyApplied");

  return (
    <View style={{ justifyContent: "center", alignItems: "center", zIndex: 2 }}>
      <View style={{ maxWidth: launchpadCreateFormMaxWidth, width: "100%" }}>
        <BrandText style={fontMedium20}>Collection details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontMedium14, { color: neutral77 }]}>
          Information about your collection
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Website Link"
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                Your project's website. It must display the project's discord
                and twitter, the roadmap/whitepaper and team's information.
                Please, be fully transparent to facilitate your project's review
                !
              </BrandText>
            </View>
          }
          placeHolder="https://website..."
          name="websiteLink"
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
                  <BrandText style={[fontMedium13, { color: neutral55 }]}>
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
  );
};
