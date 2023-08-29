import React from "react";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RangeSlider } from "../../../components/RangeSlider";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { patternOnlyNumbers } from "../../../utils/formRules";
import { neutral33, neutral77, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { ConfigureVotingFormType } from "../types";

interface ConfigureVotingSectionProps {
  onSubmit: (form: ConfigureVotingFormType) => void;
  noDuration?: boolean;
  submitLabel?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ConfigureVotingSection: React.FC<ConfigureVotingSectionProps> = ({
  onSubmit,
  noDuration,
  submitLabel,
  contentContainerStyle,
}) => {
  // variables
  const { handleSubmit, control, watch, setValue } =
    useForm<ConfigureVotingFormType>({
      defaultValues: {
        days: "1",
        hours: "0",
        minutes: "0",
        supportPercent: 50,
        minimumApprovalPercent: 15,
      },
    });
  const supportValue = watch("supportPercent");
  const minApprovalValue = watch("minimumApprovalPercent");

  // returns
  return (
    <View style={fillStyle}>
      <ScrollView
        contentContainerStyle={[containerStyle, contentContainerStyle]}
      >
        <BrandText style={fontSemibold28}>
          Choose your voting settings below
        </BrandText>
        <SpacerColumn size={2.5} />
        <RangeSlider
          label="Support %"
          value={supportValue}
          onValueChange={(val) => setValue("supportPercent", val)}
        />
        <SpacerColumn size={2.5} />
        <RangeSlider
          label="Minimum Approval %"
          value={minApprovalValue}
          onValueChange={(val) => setValue("minimumApprovalPercent", val)}
        />
        {!noDuration && (
          <>
            <SpacerColumn size={2.5} />
            <BrandText style={voteTextStyle}>Vote Duration</BrandText>
            <View style={voteInputContainerStyle}>
              <View style={fillStyle}>
                <TextInputCustom<ConfigureVotingFormType>
                  name="days"
                  noBrokenCorners
                  hideLabel
                  control={control}
                  label=""
                  rules={{ required: true, pattern: patternOnlyNumbers }}
                >
                  <BrandText style={durationLabelStyle}>Days</BrandText>
                </TextInputCustom>
              </View>
              <SpacerRow size={1.5} />
              <View style={fillStyle}>
                <TextInputCustom<ConfigureVotingFormType>
                  name="hours"
                  noBrokenCorners
                  hideLabel
                  control={control}
                  label=""
                  rules={{ required: true, pattern: patternOnlyNumbers }}
                >
                  <BrandText style={durationLabelStyle}>Hours</BrandText>
                </TextInputCustom>
              </View>

              <SpacerRow size={1.5} />
              <View style={fillStyle}>
                <TextInputCustom<ConfigureVotingFormType>
                  name="minutes"
                  noBrokenCorners
                  hideLabel
                  control={control}
                  label=""
                  rules={{ required: true, pattern: patternOnlyNumbers }}
                >
                  <BrandText style={durationLabelStyle}>Minutes</BrandText>
                </TextInputCustom>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={footerStyle}>
        <PrimaryButton
          size="M"
          text={submitLabel || `Next: ${ORGANIZATION_DEPLOYER_STEPS[2]}`}
          loader
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const containerStyle: ViewStyle = {
  padding: layout.contentPadding,
  paddingRight: layout.padding_x2_5,
  paddingTop: layout.topContentPaddingWithHeading,
};
const voteTextStyle: TextStyle = {
  ...fontSemibold14,
  color: neutralA3,
};
const voteInputContainerStyle: ViewStyle = {
  flexDirection: "row",
  width: 550,
  marginTop: layout.padding_x1_5,
};
const durationLabelStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
};
const fillStyle: ViewStyle = { flex: 1 };
const footerStyle: ViewStyle = {
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingVertical: layout.padding_x1_5,
  paddingHorizontal: layout.padding_x2_5,
  borderTopWidth: 1,
  borderColor: neutral33,
};
