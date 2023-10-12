import React from "react";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
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

  return (
    <View style={styles.fill}>
      <ScrollView
        contentContainerStyle={[styles.container, contentContainerStyle]}
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
            <BrandText style={styles.voteText}>Vote Duration</BrandText>
            <View style={styles.voteInputContainer}>
              <View style={styles.fill}>
                <TextInputCustom<ConfigureVotingFormType>
                  name="days"
                  noBrokenCorners
                  hideLabel
                  control={control}
                  label=""
                  rules={{ required: true, pattern: patternOnlyNumbers }}
                >
                  <BrandText style={styles.durationLabel}>Days</BrandText>
                </TextInputCustom>
              </View>
              <SpacerRow size={1.5} />
              <View style={styles.fill}>
                <TextInputCustom<ConfigureVotingFormType>
                  name="hours"
                  noBrokenCorners
                  hideLabel
                  control={control}
                  label=""
                  rules={{ required: true, pattern: patternOnlyNumbers }}
                >
                  <BrandText style={styles.durationLabel}>Hours</BrandText>
                </TextInputCustom>
              </View>

              <SpacerRow size={1.5} />
              <View style={styles.fill}>
                <TextInputCustom<ConfigureVotingFormType>
                  name="minutes"
                  noBrokenCorners
                  hideLabel
                  control={control}
                  label=""
                  rules={{ required: true, pattern: patternOnlyNumbers }}
                >
                  <BrandText style={styles.durationLabel}>Minutes</BrandText>
                </TextInputCustom>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    padding: layout.contentSpacing,
    paddingRight: layout.spacing_x2_5,
    paddingTop: layout.topContentSpacingWithHeading,
  },
  voteText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  voteInputContainer: {
    flexDirection: "row",
    width: 550,
    marginTop: layout.spacing_x1_5,
  },
  durationInputContainer: {
    padding: layout.spacing_x2,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  durationLabel: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
  fill: { flex: 1 },
  footer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: layout.spacing_x1_5,
    paddingHorizontal: layout.spacing_x2_5,
    borderTopWidth: 1,
    borderColor: neutral33,
  },
});
