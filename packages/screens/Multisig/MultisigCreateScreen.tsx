import { createMultisigThresholdPubkey } from "@cosmjs/amino";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";

import { MultisigSection } from "./components/MultisigSection";
import trashSVG from "../../../assets/icons/trash.svg";
import walletInputSVG from "../../../assets/icons/wallet-input.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { SearchNSInputContainer } from "../../components/inputs/SearchNSInputContainer";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../components/inputs/TextInputOutsideLabel";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMultisigAuthToken } from "../../hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "../../hooks/multisig/useMultisigClient";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getUserId, parseUserId } from "../../networks";
import { getCosmosAccount } from "../../utils/cosmos";
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
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

type CreateMultisigWalletFormType = {
  addresses: { address: string }[];
  signatureRequired: string;
  maxSignature: string;
  name: string;
};

const emptyPubKeyGroup = () => ({ address: "", compressedPubkey: "" });

export const MultisigCreateScreen = () => {
  const selectedWallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(selectedWallet?.userId);
  const { wrapWithFeedback } = useFeedbacks();
  const { control, handleSubmit, watch, setValue } =
    useForm<CreateMultisigWalletFormType>();
  const [addressIndexes, setAddressIndexes] = useState([
    emptyPubKeyGroup(),
    emptyPubKeyGroup(),
  ]);
  const navigation = useAppNavigation();
  const signatureRequiredValue = watch("signatureRequired");
  useEffect(() => {
    if (!authToken) {
      setTimeout(() => {
        // without timeout, the navigation action is not handled
        navigation.navigate("Multisig");
      }, 1000);
    }
  }, [authToken, navigation]);

  const defaultNbSignaturesRequired = useMemo(
    () => addressIndexes.length.toString(),
    [addressIndexes.length],
  );

  const selectedNetwork = useSelectedNetworkInfo();

  const multisigClient = useMultisigClient(selectedNetwork?.id);

  const removeAddressField = (index: number) => {
    const copyIndexes = [...addressIndexes];
    copyIndexes.splice(index, 1);
    setAddressIndexes(copyIndexes);
  };

  const addAddressField = () => {
    setAddressIndexes([...addressIndexes, emptyPubKeyGroup()]);
  };

  const onSubmit = async ({
    signatureRequired,
    name,
  }: CreateMultisigWalletFormType) => {
    if (!selectedNetwork) {
      throw new Error("No network selected");
    }

    if (selectedNetwork.kind !== NetworkKind.Cosmos) {
      throw new Error("Only Cosmos networks are supported");
    }

    const compressedPubkeys = addressIndexes.map(
      (item) => item.compressedPubkey,
    );
    const pubkeys = compressedPubkeys.map((compressedPubkey) => {
      return {
        type: "tendermint/PubKeySecp256k1",
        value: compressedPubkey,
      };
    });
    const multisigPubkey = createMultisigThresholdPubkey(
      pubkeys,
      parseInt(signatureRequired, 10),
    );

    const res = await multisigClient.CreateOrJoinMultisig({
      authToken,
      chainId: selectedNetwork.chainId,
      bech32Prefix: selectedNetwork.addressPrefix,
      multisigPubkeyJson: JSON.stringify(multisigPubkey),
      name,
    });

    navigation.navigate("MultisigWalletDashboard", {
      id: getUserId(selectedNetwork?.id, res.multisigAddress),
    });
  };

  const onAddressChange = async (index: number, value: string) => {
    const resValAddress = validateAddress(value);

    if (resValAddress !== true) return "Invalid address";

    const address = value;

    if (addressIndexes.find((a, i) => a.address === address && i !== index))
      return "This address is already used in this form.";

    const tempPubkeys = [...addressIndexes];
    const account = await getCosmosAccount(
      getUserId(selectedNetwork?.id, address),
    );
    if (!account?.pubkey) {
      return "Account has no public key on chain, this address will need to send a transaction before it can be added to a multisig.";
    }
    tempPubkeys[index].address = address;
    tempPubkeys[index].compressedPubkey = account.pubkey.value;
    setAddressIndexes(tempPubkeys);
  };

  return (
    <ScreenContainer
      headerChildren={
        <BrandText style={fontSemibold20}>Multisig Wallet</BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Multisig")
      }
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <ScrollView
        contentContainerStyle={{
          padding: layout.contentSpacing,
          paddingTop: layout.topContentSpacingWithHeading,
        }}
      >
        <View
          style={{
            height: "100%",
            maxWidth: 793,
          }}
        >
          <BrandText style={fontSemibold28}>Create a Legacy Multisig</BrandText>
          <SpacerColumn size={2.5} />
          <MultisigSection
            title="What is a Multisignature Wallet?"
            containerStyle={{
              maxWidth: 487,
            }}
          >
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              This wallet adress is owned managed by at least 2 different
              addresses and require signatures from co-owners to execute a
              transaction.
            </BrandText>
          </MultisigSection>
          <SpacerColumn size={3} />
          <TextInputCustom<CreateMultisigWalletFormType>
            name="name"
            control={control}
            variant="labelOutside"
            noBrokenCorners
            label="Multisig name"
            rules={{
              required: true,
            }}
            placeHolder="Type the name of the multisig"
            iconSVG={walletInputSVG}
          />
          <SpacerColumn size={3} />

          {addressIndexes.map((_, index) => (
            <>
              <View key={index.toString()}>
                <SearchNSInputContainer
                  searchText={watch(`addresses.${index}.address`)}
                  onPressName={(userId) => {
                    const [, address] = parseUserId(userId);
                    if (!address) {
                      return;
                    }
                    setValue(`addresses.${index}.address`, address);
                  }}
                >
                  <TextInputCustom<CreateMultisigWalletFormType>
                    defaultValue={index === 0 ? selectedWallet?.address : ""}
                    control={control}
                    name={`addresses.${index}.address`}
                    variant="labelOutside"
                    noBrokenCorners
                    label={"Address #" + (index + 1)}
                    rules={{
                      required: true,
                      validate: (value) => onAddressChange(index, value),
                    }}
                    placeHolder="Account address"
                    iconSVG={walletInputSVG}
                  >
                    {addressIndexes.length > 2 && (
                      <Pressable
                        style={{
                          height: 32,
                          width: 32,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 10,
                          backgroundColor: trashBackground,
                          position: "absolute",
                          right: 0,
                        }}
                        onPress={() => removeAddressField(index)}
                      >
                        <SVG source={trashSVG} width={12} height={12} />
                      </Pressable>
                    )}
                  </TextInputCustom>
                </SearchNSInputContainer>
              </View>
              <SpacerColumn size={2.5} />
            </>
          ))}
          <View style={{ flexDirection: "row" }}>
            <SecondaryButton
              size="M"
              text="Add another address"
              onPress={addAddressField}
            />
          </View>
          <SpacerColumn size={2.5} />
          <View
            style={{
              paddingVertical: layout.spacing_x2_5,
              borderTopWidth: 1,
              borderColor: neutral33,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: 793,
            }}
          >
            <TextInputOutsideLabel
              label="Number of Signatures required"
              isAsterickSign
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInputCustom<CreateMultisigWalletFormType>
                defaultValue={defaultNbSignaturesRequired}
                control={control}
                noBrokenCorners
                name="signatureRequired"
                label=""
                hideLabel
                width={80}
                rules={{
                  required: true,
                  pattern: patternOnlyNumbers,
                  validate: (value) =>
                    validateMaxNumber(value, addressIndexes.length),
                }}
                errorStyle={{ paddingLeft: layout.spacing_x1_5 }}
              />
              <SpacerRow size={2} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                signatures required on total of
              </BrandText>
              <SpacerRow size={2} />
              <TextInputCustom<CreateMultisigWalletFormType>
                control={control}
                noBrokenCorners
                name="maxSignature"
                label=""
                hideLabel
                width={80}
                defaultValue={defaultNbSignaturesRequired}
                disabled
              />
            </View>
          </View>

          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            This means that each transaction this multisig makes will require{" "}
            {signatureRequiredValue || defaultNbSignaturesRequired} of the
            members to sign it for it to be accepted by the validators.
          </BrandText>

          <SpacerColumn size={2.5} />

          <View
            style={{
              borderTopWidth: 1,
              borderColor: neutral33,
              paddingTop: layout.spacing_x2_5,
              zIndex: 1,
            }}
          />

          <SpacerColumn size={3} />

          <View style={{ flexDirection: "row" }}>
            <PrimaryButton
              size="XL"
              text="Create Multisig"
              onPress={handleSubmit((arg) =>
                wrapWithFeedback(() => onSubmit(arg))(),
              )}
              loader
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
