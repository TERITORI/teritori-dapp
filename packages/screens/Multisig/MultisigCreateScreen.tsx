import { createMultisigThresholdPubkey } from "@cosmjs/amino";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { z } from "zod";

import { MultisigSection } from "./components/MultisigSection";
import trashSVG from "../../../assets/icons/trash.svg";
import walletInputSVG from "../../../assets/icons/wallet-input.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SearchNSInputContainer } from "@/components/inputs/SearchNSInputContainer";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { TextInputOutsideLabel } from "@/components/inputs/TextInputOutsideLabel";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useMultisigAuthToken } from "@/hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "@/hooks/multisig/useMultisigClient";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { getUserId, NetworkKind, parseUserId } from "@/networks";
import { getCosmosAccount } from "@/utils/cosmos";
import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import {
  patternOnlyNumbers,
  validateAddress,
  validateMaxNumber,
} from "@/utils/formRules";
import {
  neutral33,
  neutral77,
  neutralA3,
  neutralFF,
  trashBackground,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const zodCreateMultisigWalletFormType = z.object({
  addresses: z
    .array(
      z
        .string()
        .trim()
        .min(1, DEFAULT_FORM_ERRORS.required)
        // Error if the address is not bech32
        .refine(
          (value) => validateAddress(value) === true,
          DEFAULT_FORM_ERRORS.address,
        ),
    )
    .min(1, DEFAULT_FORM_ERRORS.emptyArray),
  signatureRequired: z
    .string()
    .trim()
    // Error if empty address input
    .min(1, DEFAULT_FORM_ERRORS.required),
  maxSignature: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  name: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
});

type CreateMultisigWalletFormType = z.infer<
  typeof zodCreateMultisigWalletFormType
>;

interface PubKey {
  type: string;
  value: string;
}

export const MultisigCreateScreen = () => {
  const selectedWallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(selectedWallet?.userId);
  const { wrapWithFeedback } = useFeedbacks();
  const { control, handleSubmit, watch, setValue, setError } =
    useForm<CreateMultisigWalletFormType>({
      defaultValues: {
        addresses: ["", ""],
      },
      resolver: zodResolver(zodCreateMultisigWalletFormType),
      mode: "onSubmit",
    });

  const navigation = useAppNavigation();
  const signatureRequiredValue = watch("signatureRequired");
  const addresses = watch("addresses");
  useEffect(() => {
    if (!authToken) {
      setTimeout(() => {
        // without timeout, the navigation action is not handled
        navigation.navigate("Multisig");
      }, 1000);
    }
  }, [authToken, navigation]);
  const defaultNbSignaturesRequired = useMemo(
    () => addresses.length.toString(),
    [addresses.length],
  );
  const selectedNetwork = useSelectedNetworkInfo();
  const multisigClient = useMultisigClient(selectedNetwork?.id);
  const [addressIndexesLoading, setAddressIndexesLoading] = useState<number[]>(
    [],
  );
  const enableAddressLoading = (index: number) =>
    setAddressIndexesLoading((indexes) => [...indexes, index]);
  const disableAddressLoading = (index: number) =>
    setAddressIndexesLoading((indexes) => indexes.filter((i) => i !== index));

  const removeAddressField = (index: number) => {
    const copyIndexes = [...addresses];
    copyIndexes.splice(index, 1);
    setValue("addresses", copyIndexes);
    disableAddressLoading(index);
  };

  const addAddressField = () => {
    setValue("addresses", [...addresses, ""]);
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

    // Errors if there are duplicated addresses
    const controledAddresses = new Map();
    const duplicatesIndexes: number[] = [];
    addresses.forEach((address, index) => {
      if (controledAddresses.has(address)) {
        duplicatesIndexes.push(index);
      } else {
        controledAddresses.set(address, index);
      }
    });
    if (duplicatesIndexes.length) {
      duplicatesIndexes.forEach((index) => {
        setError(`addresses.${index}`, {
          message: "This address is already used in this form",
        });
      });
      throw new Error("The form is invalid");
    }

    // Getting public keys
    const pubkeys: PubKey[] = await Promise.all(
      addresses.map(async (address, index) => {
        const pubkey = {
          type: "tendermint/PubKeySecp256k1",
          value: "",
        };

        // Errors if the address doesn't correspond to the selected network
        if (!address.includes(selectedNetwork.addressPrefix)) {
          setError(`addresses.${index}`, {
            message: `Only ${selectedNetwork.displayName} address is allowed`,
          });
          disableAddressLoading(index);
          return pubkey;
        }

        // Getting Cosmos account
        enableAddressLoading(index);
        try {
          const account = await getCosmosAccount(
            getUserId(selectedNetwork.id, address),
          );
          // Error if no pubKey found in the Cosmos account
          if (!account?.pubkey) {
            setError(`addresses.${index}`, {
              message:
                "Account has no public key on chain, this address will need to send a transaction before it can be added to a multisig",
            });
            return pubkey;
          }
          pubkey.value = account.pubkey.value;
        } catch {
          // Error if getCosmosAccount fails
          setError(`addresses.${index}`, {
            message: "Failed to get Cosmos account",
          });
        } finally {
          disableAddressLoading(index);
          return pubkey;
        }
      }),
    );
    // Error if there are addresses without public key
    if (pubkeys.find((pubKey) => !pubKey.value)) {
      throw new Error("The form is invalid");
    }

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

          {addresses.map((_, index) => (
            <Fragment key={index}>
              <SearchNSInputContainer
                searchText={watch(`addresses.${index}`)}
                onPressName={(userId) => {
                  const [, address] = parseUserId(userId);
                  if (!address) {
                    return;
                  }
                  setValue(`addresses.${index}`, address);
                }}
              >
                <TextInputCustom<CreateMultisigWalletFormType>
                  defaultValue={index === 0 ? selectedWallet?.address : ""}
                  control={control}
                  name={`addresses.${index}`}
                  variant="labelOutside"
                  noBrokenCorners
                  label={"Address #" + (index + 1)}
                  rules={{
                    required: true,
                  }}
                  placeHolder="Account address"
                  iconSVG={walletInputSVG}
                >
                  {addressIndexesLoading.find(
                    (indexLoading) => indexLoading === index,
                  ) && <ActivityIndicator color={neutralFF} size={20} />}
                  {addresses.length > 2 && (
                    <Pressable
                      style={{
                        height: 32,
                        width: 32,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: trashBackground,
                        marginLeft: layout.spacing_x2,
                      }}
                      onPress={() => removeAddressField(index)}
                    >
                      <SVG source={trashSVG} width={12} height={12} />
                    </Pressable>
                  )}
                </TextInputCustom>
              </SearchNSInputContainer>
              <SpacerColumn size={2.5} />
            </Fragment>
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
                    validateMaxNumber(value, addresses.length),
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
              isLoading={!!addressIndexesLoading.length}
              disabled={!!addressIndexesLoading.length}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
