import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { ImagePreviewer } from "./ImagePreviewer";
import { RadioDescriptionSelector } from "./RadioDescriptionSelector";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZER_DEPLOYER_STEPS } from "../OrganizerDeployerScreen";
import { CreateDaoFormType } from "../types";

const RADIO_DESCRIPTION_TYPES = ["Membership", "Governance", "Decentralized"];

interface CreateDAOSectionProps {
  onSubmit: (form: CreateDaoFormType) => void;
}

export const CreateDAOSection: React.FC<CreateDAOSectionProps> = ({
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isValid },
  } = useForm<CreateDaoFormType>({
    defaultValues: { structure: RADIO_DESCRIPTION_TYPES[0] },
    mode: "all",
  });

  const selectedRadioDescription = watch("structure");
  const uri = watch("imageUrl");

  // functions
  const onErrorImageLoading = () =>
    setError("imageUrl", {
      type: "pattern",
      message: "This image is invalid",
    });

  // returns
  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandText style={fontSemibold28}>
          Create a Teritori Organization
        </BrandText>
        <SpacerColumn size={2} />
        <BrandText style={styles.sectionTitle}>Claim a name</BrandText>
        <SpacerColumn size={2.5} />
        <View style={styles.section}>
          <ImagePreviewer uri={uri} onError={onErrorImageLoading} />
          <SpacerRow size={2.5} />
          <View style={styles.fill}>
            <View style={styles.row}>
              <View style={styles.fill}>
                <TextInputCustom<CreateDaoFormType>
                  control={control}
                  noBrokenCorners
                  variant="labelOutside"
                  label="Organization's name"
                  placeHolder="Type organization's name here"
                  name="organizationName"
                  rules={{ required: true }}
                />
              </View>
              <SpacerRow size={2.5} />
              <View style={styles.fill}>
                <TextInputCustom<CreateDaoFormType>
                  control={control}
                  noBrokenCorners
                  variant="labelOutside"
                  label="Associated Teritori Name Service"
                  placeHolder="your-organization.tori"
                  name="associatedTeritoriNameService"
                  rules={{ required: true }}
                />
              </View>
            </View>

            <SpacerColumn size={2.5} />
            <TextInputCustom<CreateDaoFormType>
              control={control}
              noBrokenCorners
              variant="labelOutside"
              label="Organization's image url"
              placeHolder="https://example.com/preview.png"
              name="imageUrl"
              rules={{ required: true }}
            />
            <SpacerColumn size={2.5} />
            <TextInputCustom<CreateDaoFormType>
              control={control}
              noBrokenCorners
              variant="labelOutside"
              label="Organization's description"
              placeHolder="Type organization's description here"
              name="organizationDescription"
              rules={{ required: true }}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <BrandText style={styles.sectionTitle}>Choose a structure</BrandText>
        <SpacerColumn size={2} />
        <View style={styles.row}>
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={selectedRadioDescription === RADIO_DESCRIPTION_TYPES[0]}
              onPress={() => setValue("structure", RADIO_DESCRIPTION_TYPES[0])}
              title="Membership-based TORG - Teritori Organization"
              description="Small organization with a few members who are likely to stick around. Members can be added and removed by a vote of existing members."
            />
          </View>
          <SpacerRow size={2} />
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={selectedRadioDescription === RADIO_DESCRIPTION_TYPES[1]}
              onPress={() => setValue("structure", RADIO_DESCRIPTION_TYPES[1])}
              title="Governance Token-based TORG - Teritori Organization"
              description="Fluid organization with many members who leave and join frequently. Members can join and leave by exchanging governance shares."
            />
          </View>
        </View>
        <SpacerColumn size={2} />
        <View style={styles.row}>
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={selectedRadioDescription === RADIO_DESCRIPTION_TYPES[2]}
              onPress={() => setValue("structure", RADIO_DESCRIPTION_TYPES[2])}
              title="Decentralized Coop Org"
              description="A cooperative company is based on a simple rule: 1 people = 1 voice, whatever the number of holded tokens."
            />
          </View>
          <SpacerRow size={2} />
          <View style={styles.fill} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          size="M"
          text={`Next: ${ORGANIZER_DEPLOYER_STEPS[1]}`}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
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
  sectionTitle: StyleSheet.flatten([fontSemibold20, { color: neutral77 }]),
  section: {
    borderRadius: 12,
    borderColor: neutral33,
    borderWidth: 1,
    padding: layout.spacing_x2_5,
    flexDirection: "row",
    marginBottom: layout.spacing_x4,
  },
  row: { flexDirection: "row" },
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
