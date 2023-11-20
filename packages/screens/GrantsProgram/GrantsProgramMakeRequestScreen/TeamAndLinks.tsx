import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { neutral55, neutral77, neutralA3 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const TeamAndLinks: React.FC = () => {
  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Links</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Your Grant useful links
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Website Link"
        name="websiteLink"
        fullWidth
        placeholder="https://website..."
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Twitter Profile *"
        name="twitterProfile"
        fullWidth
        multiline
        placeholder="Twitter Profile *"
        textInputStyle={{ height: 80 }}
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Discord Link *"
        name="discordLink"
        fullWidth
        placeholder="https://discord..."
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="GitHub Link *"
        name="githubLink"
        fullWidth
        placeholder="https://github..."
        variant="labelOutside"
      />

      <Separator style={{ marginVertical: layout.spacing_x2_5 }} />

      <BrandText style={fontSemibold20}>Links</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Your Grant useful links
      </BrandText>

      <SpacerColumn size={2} />

      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        Describe your team: *
      </BrandText>

      <BrandText style={[fontSemibold13, { color: neutral55 }]}>
        1. How many core members are you? ( Working on the project daily )
      </BrandText>
      <BrandText style={[fontSemibold13, { color: neutral55 }]}>
        2. Past accomplishments or projects?
      </BrandText>
      <BrandText style={[fontSemibold13, { color: neutral55 }]}>
        3. Please add all relevant links for all your members.
      </BrandText>

      <SpacerColumn size={1} />

      <TextInputCustom
        label=""
        name="teamDescription"
        fullWidth
        multiline
        placeholder="Describe here..."
        textInputStyle={{ height: 80 }}
        hideLabel
      />

      <SpacerColumn size={2} />

      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        Team links and attachments
      </BrandText>
    </View>
  );
};
