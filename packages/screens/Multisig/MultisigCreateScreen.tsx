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
import { useMultisigContext } from "../../context/MultisigReducer";
import { useCreateMultisig } from "../../hooks/useCreateMultisig";
import { useMultisigHelpers } from "../../hooks/useMultisigHelpers";
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

const emptyPubKeyGroup = () => ({ address: "", compressedPubkey: "" });

export const MultisigCreateScreen = () => {
  // variables
  const { control, handleSubmit, watch } =
    useForm<CreateMultisigWalletFormType>();
  const [addressIndexes, setAddressIndexes] = useState([
    emptyPubKeyGroup(),
    emptyPubKeyGroup(),
  ]);
  const navigation = useAppNavigation();
  const signatureRequiredValue = watch("signatureRequired");

  const { getPubkeyFromNode } = useMultisigHelpers();
  const { mutate, isLoading, data } = useCreateMultisig();
  const { state } = useMultisigContext();

  // functions
  const removeAddressField = (index: number) => {
    const copyIndexes = [...addressIndexes];
    copyIndexes.splice(index, 1);
    setAddressIndexes(copyIndexes);
  };

  const addAddressField = () => {
    setAddressIndexes([...addressIndexes, emptyPubKeyGroup()]);
  };

  const onSubmit = ({ signatureRequired }: CreateMultisigWalletFormType) => {
    if (state.chain?.chainId && state.chain?.addressPrefix) {
      const compressedPubkeys = addressIndexes.map(
        (item) => item.compressedPubkey
      );

      mutate({
        compressedPubkeys,
        chainId: state.chain.chainId,
        addressPrefix: state.chain?.addressPrefix,
        threshold: parseInt(signatureRequired, 10),
      });
    }
  };

  const onAddressChange = async (index: number, value: string) => {
    const resValAddress = validateAddress(value);
    if (resValAddress !== true) return resValAddress;
    if (addressIndexes.find((a, i) => a.address === value && i !== index))
      return "This address is already used in this form.";

    try {
      const tempPubkeys = [...addressIndexes];
      const pubkey = await getPubkeyFromNode(value);
      tempPubkeys[index].address = value;
      tempPubkeys[index].compressedPubkey = pubkey;
      setAddressIndexes(tempPubkeys);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error.message;
    }
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
          {addressIndexes.map((_, index) => (
            <View style={styles.inputContainer} key={index.toString()}>
              <TextInputCustom<CreateMultisigWalletFormType>
                control={control}
                name={`addresses.${index}.address`}
                variant="noCropBorder"
                label={"Address #" + (index + 1)}
                isAsterickSign
                rules={{
                  required: true,
                  validate: (value) => onAddressChange(index, value),
                }}
                placeHolder="Account address"
                iconSVG={walletInputSVG}
              >
                {addressIndexes.length > 2 && (
                  <Pressable
                    style={styles.trashContainer}
                    onPress={() => removeAddressField(index)}
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
            {signatureRequiredValue || 0} of the members to sign it for it to be
            accepted by the validators.
          </BrandText>
          <SpacerColumn size={2.5} />
          <View style={styles.row}>
            <PrimaryButton
              size="XL"
              text="Create Multisig"
              onPress={handleSubmit(onSubmit)}
              loader
            />
          </View>
        </View>
      </ScrollView>
      <CheckLoadingModal
        isVisible={isLoading}
        onComplete={() => {
          data && navigation.navigate("MultisigLegacy", { address: data });
        }}
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
