import React, { FC, useEffect, useState } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

import trashSVG from "../../../../assets/icons/trash.svg";
import walletInputSVG from "../../../../assets/icons/wallet-input.svg";
import { SVG } from "../../../components/SVG";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { SearchNSInputContainer } from "../../../components/inputs/SearchNSInputContainer";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerRow } from "../../../components/spacer";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseUserId } from "../../../networks";
import { patternOnlyNumbers, validateAddress } from "../../../utils/formRules";
import { layout } from "../../../utils/style/layout";
import { MemberSettingFormType } from "../types";

export const MembersFields: FC<{
  setValue: UseFormSetValue<MemberSettingFormType>;
  watch: UseFormWatch<MemberSettingFormType>;
  control: Control<MemberSettingFormType>;
  networkId?: string;
  autoAddUser?: boolean;
}> = ({ networkId, setValue, watch, control, autoAddUser }) => {
  const selectedWallet = useSelectedWallet();
  const [addressIndexes, setAddressIndexes] = useState<number[]>([0]);

  const removeAddressField = (id: number) => {
    if (addressIndexes.length > 1) {
      const copyIndex = [...addressIndexes].filter((i) => i !== id);
      setAddressIndexes(copyIndex);
    }
  };

  const addAddressField = () => {
    setAddressIndexes([...addressIndexes, Math.floor(Math.random() * 200000)]);
  };

  useEffect(() => {
    if (selectedWallet?.address && autoAddUser)
      setValue("members", [{ addr: selectedWallet.address, weight: 1 }]);
  }, [setValue, selectedWallet?.address, autoAddUser]);

  return (
    <>
      {networkId &&
        addressIndexes.map((id, index) => (
          <View style={styles.inputContainer} key={id.toString()}>
            <View style={styles.leftInput}>
              <SearchNSInputContainer
                onPressName={(userId) => {
                  const [, userAddress] = parseUserId(userId);
                  setValue(`members.${index}.addr`, userAddress);
                }}
                searchText={watch(`members.${index}.addr`)}
                networkId={networkId}
                hideDAOs
              >
                <TextInputCustom<MemberSettingFormType>
                  name={`members.${index}.addr`}
                  noBrokenCorners
                  label="Member Address"
                  variant="labelOutside"
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
              </SearchNSInputContainer>
            </View>
            <SpacerRow size={2.5} />
            <View style={styles.rightInput}>
              <TextInputCustom<MemberSettingFormType>
                name={`members.${index}.weight`}
                noBrokenCorners
                label="Weight"
                variant="labelOutside"
                hideLabel={index > 0}
                control={control}
                rules={{ required: true, pattern: patternOnlyNumbers }}
                placeHolder="1"
              />
            </View>
          </View>
        ))}

      <SecondaryButton size="M" text="Add More" onPress={addAddressField} />
    </>
  );
};

const styles = StyleSheet.create({
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
});
