import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import trashSVG from "../../../../../assets/icons/trash.svg";
import walletInputSVG from "../../../../../assets/icons/wallet-input.svg";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { patternOnlyNumbers, validateAddress } from "@/utils/formRules";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS,
  MembershipMemberSettingFormType,
} from "@/utils/types/organizations";

interface MembershipMemberSettingsSectionProps {
  onSubmit: (form: MembershipMemberSettingFormType) => void;
}

export const MembershipMemberSettingsSection: React.FC<
  MembershipMemberSettingsSectionProps
> = ({ onSubmit }) => {
  const { handleSubmit, control, resetField } =
    useForm<MembershipMemberSettingFormType>();

  // this effect put the selected wallet address in the first field only on initial load
  const selectedWallet = useSelectedWallet();
  const [initialReset, setInitialReset] = useState(false);
  useEffect(() => {
    if (initialReset) {
      return;
    }
    if (!selectedWallet?.address) {
      return;
    }
    resetField("members.0.addr", {
      defaultValue: selectedWallet?.address,
    });
    setInitialReset(true);
  }, [selectedWallet?.address, resetField, initialReset]);

  const [addressIndexes, setAddressIndexes] = useState<number[]>([0]);

  // functions
  const removeAddressField = (id: number) => {
    if (addressIndexes.length > 1) {
      const copyIndex = [...addressIndexes].filter((i) => i !== id);
      setAddressIndexes(copyIndex);
    }
  };

  const addAddressField = () => {
    setAddressIndexes([...addressIndexes, Math.floor(Math.random() * 200000)]);
  };

  return (
    <View style={fillCStyle}>
      <ScrollView contentContainerStyle={containerCStyle}>
        <BrandText style={fontSemibold28}>Members</BrandText>
        <SpacerColumn size={2.5} />

        {addressIndexes.map((id, index) => (
          <View style={inputContainerCStyle} key={id.toString()}>
            <View style={leftInputCStyle}>
              <TextInputCustom<MembershipMemberSettingFormType>
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
                  style={trashContainerCStyle}
                  onPress={() => removeAddressField(id)}
                >
                  <SVG source={trashSVG} width={12} height={12} />
                </Pressable>
              </TextInputCustom>
            </View>
            <SpacerRow size={2.5} />
            <View style={rightInputCStyle}>
              <TextInputCustom<MembershipMemberSettingFormType>
                name={`members.${index}.weight`}
                noBrokenCorners
                label="Weight"
                hideLabel={index > 0}
                defaultValue="1"
                control={control}
                rules={{ required: true, pattern: patternOnlyNumbers }}
                placeHolder="1"
              />
            </View>
          </View>
        ))}

        <SecondaryButton size="SM" text="Add More" onPress={addAddressField} />
      </ScrollView>

      <View style={footerCStyle}>
        <PrimaryButton
          size="M"
          text={`Next: ${MEMBERSHIP_ORGANIZATION_DEPLOYER_STEPS[3]}`}
          onPress={handleSubmit(onSubmit)}
          testID="member-settings-next"
        />
      </View>
    </View>
  );
};

const containerCStyle: ViewStyle = {
  padding: layout.contentSpacing,
  paddingRight: layout.spacing_x2_5,
  paddingTop: layout.topContentSpacingWithHeading,
};

const leftInputCStyle: ViewStyle = { flex: 4 };

const rightInputCStyle: ViewStyle = { flex: 1 };

const inputContainerCStyle: ViewStyle = {
  flexDirection: "row",
  marginBottom: layout.spacing_x2,
};

const trashContainerCStyle: ViewStyle = {
  height: 16,
  width: 16,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  backgroundColor: "rgba(244, 111, 118, 0.1)",
};

const fillCStyle: ViewStyle = { flex: 1 };

const footerCStyle: ViewStyle = {
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingVertical: layout.spacing_x1_5,
  paddingHorizontal: layout.spacing_x2_5,
  borderTopWidth: 1,
  borderColor: neutral33,
};
