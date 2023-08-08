import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import trashSVG from "../../../../assets/icons/trash.svg";
import walletInputSVG from "../../../../assets/icons/wallet-input.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { patternOnlyNumbers, validateAddress } from "../../../utils/formRules";
import { neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { MemberSettingFormType } from "../types";

interface MemberSettingsSectionProps {
  onSubmit: (form: MemberSettingFormType) => void;
}

export const MemberSettingsSection: React.FC<MemberSettingsSectionProps> = ({
  onSubmit,
}) => {
  // variables
  // const { handleSubmit, control, unregister } = useForm<MemberSettingFormType>();
  const { handleSubmit, control } = useForm<MemberSettingFormType>();
  const [addressIndexes, setAddressIndexes] = useState<number[]>([0]);

  // functions
  const removeAddressField = (id: number) => {
    if (addressIndexes.length > 1) {
      const copyIndex = [...addressIndexes].filter((i) => i !== id);
      setAddressIndexes(copyIndex);
      // unregister(`members.${id}`);
    }
  };

  const addAddressField = () => {
    setAddressIndexes([...addressIndexes, Math.floor(Math.random() * 200000)]);
  };

  // returns
  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandText style={fontSemibold28}>Add member</BrandText>
        <SpacerColumn size={2.5} />

        {addressIndexes.map((id, index) => (
          <View style={styles.inputContainer} key={id.toString()}>
            <View style={styles.leftInput}>
              <TextInputCustom<MemberSettingFormType>
                name={`members.${index}.addr`}
                noBrokenCorners
                label="Member Address"
                hideLabel={index > 0}
                control={control}
                rules={{ required: true, validate: validateAddress }}
                placeHolder="Account address"
                iconSVG={walletInputSVG}
              >
                <Pressable
                  style={styles.trashContainer}
                  onPress={() => removeAddressField(id)}
                >
                  <SVG source={trashSVG} width={12} height={12} />
                </Pressable>
              </TextInputCustom>
            </View>
            <SpacerRow size={2.5} />
            <View style={styles.rightInput}>
              <TextInputCustom<MemberSettingFormType>
                name={`members.${index}.weight`}
                noBrokenCorners
                label="Weight"
                hideLabel={index > 0}
                control={control}
                rules={{ required: true, pattern: patternOnlyNumbers }}
                placeHolder="1"
              />
            </View>
          </View>
        ))}

        <SecondaryButton size="SM" text="Add More" onPress={addAddressField} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          size="M"
          text={`Next: ${ORGANIZATION_DEPLOYER_STEPS[3]}`}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingRight: layout.padding_x2_5,
    paddingTop: layout.topContentPaddingWithHeading,
  },
  voteText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  leftInput: { flex: 4 },
  rightInput: { flex: 1 },
  inputContainer: {
    flexDirection: "row",
    marginBottom: layout.padding_x2,
  },
  trashContainer: {
    height: 16,
    width: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "rgba(244, 111, 118, 0.1)",
  },
  fill: { flex: 1 },
  footer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x2_5,
    borderTopWidth: 1,
    borderColor: neutral33,
  },
});
