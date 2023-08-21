import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { MembersFields } from "./MembersFields";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../../components/spacer";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { MemberSettingFormType } from "../types";

interface Props {
  onSubmit: (form: MemberSettingFormType) => void;
  networkId?: string;
}

export const MemberBasedSettingsSection: React.FC<Props> = ({
  onSubmit,
  networkId,
}) => {
  const selectedWallet = useSelectedWallet();
  const { handleSubmit, control, setValue, watch } =
    useForm<MemberSettingFormType>();
  useEffect(() => {
    if (selectedWallet?.address)
      setValue("members", [{ addr: selectedWallet.address, weight: 1 }]);
  }, [setValue, selectedWallet?.address]);

  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandText style={fontSemibold28}>Add members</BrandText>
        <SpacerColumn size={2.5} />

        <MembersFields
          networkId={networkId}
          control={control}
          watch={watch}
          setValue={setValue}
          autoAddUser
        />
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
