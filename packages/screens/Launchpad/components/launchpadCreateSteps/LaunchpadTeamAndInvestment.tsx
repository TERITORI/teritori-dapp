import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../CreateCollection.type";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpadRequired } from "@/screens/Launchpad/components/inputs/TextInputLaunchpadRequired";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const LaunchpadTeamAndInvestment: React.FC<{
  createCollectionForm: UseFormReturn<CollectionFormValues>;
}> = ({ createCollectionForm }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Team & Investments</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Fill the information about the team and investors
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Describe your team: "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                1. How many core members are you? ( Working on the project daily
                )
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                2. Who does what in your team?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                3. Past accomplishments or projects?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                4. How did you guys meet?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                5. Please add Linkedin links for all your members.
              </BrandText>
            </View>
          }
          placeHolder="Describe here..."
          name="teamDescription"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          required={false}
          label="Team links and attachments "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Please provide any relevant links regarding your team. You can
                also post a google drive link.
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="teamLink"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Do you have any partners on the project? "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                If yes, who are they? What do they do for you?
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="partnersDescription"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="What have you invested in this project so far? "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                1. How much upfront capital has been invested?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                2. Have you raised outside funding for the project?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                3. How long has the project been worked on?
              </BrandText>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                4. Is there a proof of concept or demo to show?
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="investDescription"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          required={false}
          label="Investment links and attachments "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Please provide any relevant links regarding your investment. You
                can also post a google drive link.
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="investLink"
          control={createCollectionForm.control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Whitepaper and roadmap: "
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Please provide any relevant link regarding your white paper and
                roadmap. You can also post a google drive link.
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="roadmapLink"
          control={createCollectionForm.control}
        />
      </View>
    </View>
  );
};
