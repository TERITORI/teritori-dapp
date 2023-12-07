import { Formik } from "formik";
import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { TeamAndLinkData } from "./types";
import { useMakeRequestState } from "./useMakeRequestHook";
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

const emptyValues: TeamAndLinkData = {
  websiteLink: "",
  twitterProfile: "",
  discordLink: "",
  githubLink: "",
  teamDesc: "",
};

export const TeamAndLinks: React.FC = () => {
  const {
    actions: { goNextStep, setTeamAndLink },
    teamAndLinkData,
  } = useMakeRequestState();

  const validate = (values: TeamAndLinkData) => {
    const errors: any = {};
    if (!values.websiteLink) {
      errors.websiteLink = "Website Link is required";
    } else if (!values.twitterProfile) {
      errors.twitterProfile = "Twitter Profile is required";
    }
    return errors;
  };

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Links</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Your Grant useful links
      </BrandText>

      <SpacerColumn size={2.5} />

      <Formik
        initialValues={teamAndLinkData || emptyValues}
        validate={validate}
        onSubmit={(values) => {
          setTeamAndLink(values);
          goNextStep();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <TextInputCustom
              label="Website Link"
              name="websiteLink"
              fullWidth
              placeholder="https://website..."
              variant="labelOutside"
              onChangeText={handleChange("websiteLink")}
              value={values.websiteLink}
              error={errors.websiteLink}
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
              onChangeText={handleChange("twitterProfile")}
              value={values.twitterProfile}
              error={errors.twitterProfile}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="Discord Link *"
              name="discordLink"
              fullWidth
              placeholder="https://discord..."
              variant="labelOutside"
              onChangeText={handleChange("discordLink")}
              value={values.discordLink}
              error={errors.discordLink}
            />

            <SpacerColumn size={2.5} />

            <TextInputCustom
              label="GitHub Link *"
              name="githubLink"
              fullWidth
              placeholder="https://github..."
              variant="labelOutside"
              onChangeText={handleChange("githubLink")}
              value={values.githubLink}
              error={errors.githubLink}
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
              name="teamDesc"
              fullWidth
              multiline
              placeholder="Describe here..."
              textInputStyle={{ height: 80 }}
              hideLabel
              onChangeText={handleChange("teamDesc")}
              value={values.teamDesc}
              error={errors.teamDesc}
            />

            <SpacerColumn size={2} />

            <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
              Team links and attachments
            </BrandText>

            <MakeRequestFooter
              disableNext={Object.keys(errors).length !== 0}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </Formik>
    </View>
  );
};
