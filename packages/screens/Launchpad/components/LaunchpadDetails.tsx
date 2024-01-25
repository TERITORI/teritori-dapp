import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { MultipleSelectionDropdown } from "./dropdowns/MultipleSelectionDropdown";
import { SelectionDropdown } from "./dropdowns/SelectionDropdown";
import { TextInputLaunchpad } from "./inputs/TextInputLaunchpad";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { neutral55, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewCollectionDetailsFormValues } from "../CreateCollection.type";

export const LaunchpadDetails: React.FC = () => {
  const dropdownOptions = ["Yes", "No"];
  const projectOptions = ["PFP", "Utility", "Metaverse", "P2E", "Other"];

  const [isDerivativeProject, setIsDerivativeProject] = useState("");
  const [isPreviouslyApplied, setIsPreviouslyApplied] = useState("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  const { control } = useForm<NewCollectionDetailsFormValues>({
    defaultValues: {
      websiteLink: "",
      twitterProfileUrl: "",
      twitterFollowers: "",
      discordName: "",
      email: "",
      projectDesciption: "",
      projectType: "",
    },
    mode: "onBlur",
  });

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Collection details</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Information about your collection
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<NewCollectionDetailsFormValues>
          label="Website Link"
          placeHolder="https://website..."
          name="websiteLink"
          control={control}
        />

        <TextInputLaunchpad<NewCollectionDetailsFormValues>
          required
          label="Twitter Profile "
          placeHolder="https://twitter..."
          name="twitterProfileUrl"
          control={control}
        />

        <TextInputLaunchpad<NewCollectionDetailsFormValues>
          required
          label="How many Twitter followers does your project have? "
          placeHolder="10,000"
          name="twitterFollowers"
          control={control}
        />

        <TextInputLaunchpad<NewCollectionDetailsFormValues>
          required
          label="Discord name of your main contact: "
          placeHolder="nickname#0000"
          name="discordName"
          control={control}
        />

        <TextInputLaunchpad<NewCollectionDetailsFormValues>
          required
          label="Main contact email address: "
          placeHolder="contact@email.com"
          name="email"
          control={control}
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={isDerivativeProject}
          setItem={setIsDerivativeProject}
          label="Is your project a derivative project?"
          style={{ zIndex: 3 }}
        />

        <MultipleSelectionDropdown
          dropdownOptions={projectOptions}
          placeHolder="Select Option"
          items={projectTypes}
          setItems={(item) => {
            if (projectTypes.includes(item)) {
              setProjectTypes(projectTypes.filter((data) => data !== item));
            } else {
              setProjectTypes([...projectTypes, item]);
            }
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

        <TextInputLaunchpad<NewCollectionDetailsFormValues>
          required
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
          name="projectDesciption"
          control={control}
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={isPreviouslyApplied}
          setItem={setIsPreviouslyApplied}
          label="Have you previously applied for the same project before?"
          style={{ zIndex: 1 }}
        />
      </View>
    </View>
  );
};
