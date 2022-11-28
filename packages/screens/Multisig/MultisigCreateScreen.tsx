import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import trashSVG from "../../../assets/icons/trash.svg";
import walletSVG from "../../../assets/icons/wallet-grey.svg";
import walletInputSVG from "../../../assets/icons/wallet-input.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../components/inputs/TextInputOutsideLabel";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import {
  neutral33,
  neutral77,
  neutralA3,
  trashBackground,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { CreateMultisigWalletFormType } from "./types";

export const MultisigCreateScreen = () => {
  // variables
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateMultisigWalletFormType>({ mode: "all" });
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

  // returns
  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={<BackTo label="Multisig Wallet" />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <BrandText style={fontSemibold28}>Create a Legacy Multisig</BrandText>
          <SpacerColumn size={2.5} />

          <View style={styles.descriptionContainer}>
            <View style={[styles.descriptionHeader, styles.rowCenter]}>
              <SVG source={walletSVG} height={28} width={28} />
              <BrandText style={[fontSemibold16, { color: neutralA3 }]}>
                What is a Multisignature Wallet?
              </BrandText>
            </View>
            <View style={styles.descriptionFooter}>
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                This wallet adress is owned managed by at least 2 different
                addresses and require signatures from co-owners to execute a
                transaction.
              </BrandText>
            </View>
          </View>
          <SpacerColumn size={3} />

          {addressIndexes.map((id, index) => (
            <View style={styles.inputContainer} key={id.toString()}>
              <TextInputCustom<CreateMultisigWalletFormType>
                control={control}
                name={`addresses.${index}.address`}
                variant="noCropBorder"
                label={"Address #" + (index + 1)}
                isAsterickSign
                rules={{ required: true }}
                placeHolder="Account address"
                iconSVG={walletInputSVG}
              >
                {addressIndexes.length > 1 && (
                  <Pressable
                    style={styles.trashContainer}
                    onPress={() => removeAddressField(id)}
                  >
                    <SVG source={trashSVG} width={12} height={12} />
                  </Pressable>
                )}
              </TextInputCustom>
            </View>
          ))}

          <SecondaryButton
            size="M"
            text="Add another address"
            onPress={addAddressField}
          />

          <View style={styles.signatureContainer}>
            <TextInputOutsideLabel
              label="Number of Signatures required"
              isAsterickSign
            />
            <View style={styles.rowCenter}>
              <TextInputCustom<CreateMultisigWalletFormType>
                control={control}
                variant="noCropBorder"
                mainContainerStyle={styles.smallInputContainerStyle}
                name="signatureRequired"
                label=""
                hideLabel
                width={80}
                inputStyle={styles.textCenter}
                rules={{ required: true }}
                errorStyle={{ paddingLeft: layout.padding_x1_5 }}
              />
              <SpacerRow size={2} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                signatures required on total of
              </BrandText>
              <SpacerRow size={2} />
              <TextInputCustom<CreateMultisigWalletFormType>
                control={control}
                variant="noCropBorder"
                mainContainerStyle={styles.smallInputContainerStyle}
                name="totalSignatureRequired"
                label=""
                hideLabel
                width={80}
                inputStyle={styles.textCenter}
              />
            </View>
          </View>

          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            This means that each transaction this multisig makes will require 2
            of the members to sign it for it to be accepted by the validators.
          </BrandText>
          <SpacerColumn size={2.5} />

          <PrimaryButton
            disabled={!isValid}
            size="XL"
            text="Create Multisig"
            onPress={handleSubmit(console.log)}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingTop: layout.topContentPaddingWithHeading,
  },
  rowSB: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formContainer: {
    height: "100%",
    maxWidth: 793,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  signatureContainer: {
    paddingVertical: layout.padding_x2_5,
    marginVertical: layout.padding_x2_5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: neutral33,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 793,
  },
  descriptionContainer: {
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 12,
    maxWidth: 487,
  },
  descriptionHeader: {
    padding: layout.padding_x2,
    paddingTop: layout.padding_x2_5,
  },
  descriptionFooter: {
    padding: layout.padding_x2_5,
    paddingTop: 0,
  },
  inputContainer: {
    marginBottom: layout.padding_x2_5,
  },
  trashContainer: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: trashBackground,
    position: "absolute",
    right: 0,
  },
  smallInputContainerStyle: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: { textAlign: "center" },
});
