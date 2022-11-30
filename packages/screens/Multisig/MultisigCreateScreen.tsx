import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import trashSVG from "../../../assets/icons/trash.svg";
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
  patternOnlyNumbers,
  validateAddress,
  validateMaxNumber,
} from "../../utils/formRules";
import { useAppNavigation } from "../../utils/navigation";
import {
  neutral33,
  neutral77,
  neutralA3,
  trashBackground,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { CheckLoadingModal } from "./components/CheckLoadingModal";
import { MultisigSection } from "./components/MultisigSection";
import { CreateMultisigWalletFormType } from "./types";

export const MultisigCreateScreen = () => {
  // variables
  const { control, handleSubmit, watch } =
    useForm<CreateMultisigWalletFormType>();
  const [addressIndexes, setAddressIndexes] = useState<number[]>([0, 1]);
  const [isLoadingProcessRunning, setIsLoadingProcessRunning] =
    useState<boolean>(false);
  const navigation = useAppNavigation();

  const signatureRequiredValue = watch("signatureRequired");

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

  const onSubmit = () => {
    setIsLoadingProcessRunning(true);
    setTimeout(() => {
      setIsLoadingProcessRunning(false);
    }, 3000);
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
          <MultisigSection
            title="What is a Multisignature Wallet?"
            containerStyle={styles.descriptionContainer}
          >
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              This wallet adress is owned managed by at least 2 different
              addresses and require signatures from co-owners to execute a
              transaction.
            </BrandText>
          </MultisigSection>
          <SpacerColumn size={3} />
          {addressIndexes.map((id, index) => (
            <View style={styles.inputContainer} key={id.toString()}>
              <TextInputCustom<CreateMultisigWalletFormType>
                control={control}
                name={`addresses.${index}.address`}
                variant="noCropBorder"
                label={"Address #" + (index + 1)}
                isAsterickSign
                rules={{ required: true, validate: validateAddress }}
                placeHolder="Account address"
                iconSVG={walletInputSVG}
              >
                {addressIndexes.length > 2 && (
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
          <View style={styles.row}>
            <SecondaryButton
              size="M"
              text="Add another address"
              onPress={addAddressField}
            />
          </View>
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
                rules={{
                  required: true,
                  pattern: patternOnlyNumbers,
                  validate: (value) =>
                    validateMaxNumber(value, addressIndexes.length),
                }}
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
                name="maxSignature"
                label=""
                hideLabel
                width={80}
                inputStyle={styles.textCenter}
                defaultValue={addressIndexes.length.toString()}
                disabled
              />
            </View>
          </View>
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            This means that each transaction this multisig makes will require{" "}
            {signatureRequiredValue || 2} of the members to sign it for it to be
            accepted by the validators.
          </BrandText>
          <SpacerColumn size={2.5} />
          <View style={styles.row}>
            <PrimaryButton
              size="XL"
              text="Create Multisig"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
      <CheckLoadingModal
        isVisible={isLoadingProcessRunning}
        onComplete={() => navigation.navigate("MultisigLegacy")}
      />
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
  row: { flexDirection: "row" },
  descriptionContainer: {
    maxWidth: 487,
  },
});
