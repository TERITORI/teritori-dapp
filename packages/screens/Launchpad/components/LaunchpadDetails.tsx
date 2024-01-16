import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadDetailsValues } from "./inputs/TextInputLaunchpadDetailsValues";
import { BrandText } from "../../../components/BrandText";
import { SelectionDropdown } from "../../../components/SelectionDropdown";
import { SpacerColumn } from "../../../components/spacer";
import { neutral55, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { NewCollectionDetailsFormValues } from "../CreateCollection.type";

export const LaunchpadDetails: React.FC = () => {
  const dropdownOptions = ["Yes", "No"];

  const [item, setItem] = useState("");

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

        <TextInputLaunchpadDetailsValues
          label="Website Link"
          placeHolder="https://website..."
          name="websiteLink"
          control={control}
        />

        <TextInputLaunchpadDetailsValues
          label="Twitter Profile "
          placeHolder="https://twitter..."
          name="twitterProfileUrl"
          control={control}
          required
        />

        <TextInputLaunchpadDetailsValues
          label="How many Twitter followers does your project have? "
          placeHolder="10,000"
          name="twitterFollowers"
          control={control}
          required
        />

        <TextInputLaunchpadDetailsValues
          label="Discord name of your main contact: "
          placeHolder="nickname#0000"
          name="discordName"
          control={control}
          required
        />

        <TextInputLaunchpadDetailsValues
          label="Main contact email address: "
          placeHolder="contact@email.com"
          name="email"
          control={control}
          required
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={item}
          setItem={setItem}
          label="Is your project a derivative project? *"
        />

        <TextInputLaunchpadDetailsValues
          label="Project type:"
          placeHolder="Multiple answers allowed"
          name="projectType"
          control={control}
          required
        />

        <TextInputLaunchpadDetailsValues
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
          required
        />

        <SelectionDropdown
          dropdownOptions={dropdownOptions}
          placeHolder="Select Option"
          item={item}
          setItem={setItem}
          label="Have you previously applied for the same project before? *"
        />
      </View>
    </View>
  );
};
