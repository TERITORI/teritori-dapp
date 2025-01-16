import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import { fontMedium13, fontMedium14, fontMedium20 } from "@/utils/style/fonts";
import { CollectionFormValues } from "@/utils/types/launchpad";

export const LaunchpadTeamAndInvestment: FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ maxWidth: launchpadCreateFormMaxWidth, width: "100%" }}>
        <BrandText style={fontMedium20}>Team & Investments</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontMedium14, { color: neutral77 }]}>
          Fill the information about the team and investors
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Describe your team: "
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                1. How many core members are you? ( Working on the project daily
                )
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                2. Who does what in your team?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                3. Past accomplishments or projects?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                4. How did you guys meet?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                5. Please add Linkedin links for all your members.
              </BrandText>
            </View>
          }
          placeHolder="Describe here..."
          name="teamDescription"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Do you have any partners on the project? "
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                If yes, who are they? What do they do for you?
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="partnersDescription"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="What have you invested in this project so far? "
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                1. How much upfront capital has been invested?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                2. Have you raised outside funding for the project?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                3. How long has the project been worked on?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                4. Is there a proof of concept or demo to show?
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="investDescription"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Investment links and attachments "
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                Please provide any relevant links regarding your investment. You
                can also post a google drive link.
              </BrandText>
            </View>
          }
          placeHolder="Type here..."
          name="investLink"
          form={collectionForm}
        />
      </View>
    </View>
  );
};
