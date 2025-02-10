import { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { MultipleSelectInput } from "../../../components/inputs/selectInputs/MultipleSelectInput";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { SpacerColumn } from "@/components/spacer";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import { fontMedium13, fontMedium14, fontMedium20 } from "@/utils/style/fonts";
import { CollectionFormValues } from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const LaunchpadDetails: FC<Props> = ({ collectionForm }) => {
  const projectTypes = collectionForm.watch("projectTypes") || [];

  return (
    <View style={{ justifyContent: "center", alignItems: "center", zIndex: 2 }}>
      <View style={{ maxWidth: launchpadCreateFormMaxWidth, width: "100%" }}>
        <BrandText style={fontMedium20}>Collection details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontMedium14, { color: neutral77 }]}>
          Additional information about your collection
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

        <TextInputLaunchpad<CollectionFormValues>
          label="Please describe your artwork: "
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                1. Is it completely original?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                2. Who is the artist?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                3. How did your team meet the artist?
              </BrandText>
            </View>
          }
          placeHolder="Describe here..."
          name="artworkDescription"
          form={collectionForm}
        />

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
      </View>
    </View>
  );
};
