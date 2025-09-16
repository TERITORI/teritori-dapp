import {
  createMultisigThresholdPubkey,
  pubkeyToAddress,
  Secp256k1Pubkey,
} from "@cosmjs/amino";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { Any, PubKeySecp256k1 } from "@gnolang/tm2-js-client";
import { bech32 } from "bech32";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";

import { MultisigSection } from "./components/MultisigSection";
import trashSVG from "../../../assets/icons/trash.svg";
import walletInputSVG from "../../../assets/icons/wallet-input.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
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
import {
  patternOnlyNumbers,
  validateAddress,
  validateMaxNumber,
} from "@/utils/formRules";
import {
  neutral33,
  neutral77,
  neutralA3,
  trashBackground,
} from "@/utils/style/colors";
import {
  fontRegular13,
  fontRegular14,
  fontRegular28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type CreateMultisigWalletFormType = {
  addresses: { address: string }[];
  signatureRequired: string;
  maxSignature: string;
  name: string;
};

const emptyPubKeyGroup = () => ({
  address: "",
  compressedPubkey: "",
  kind: "",
});

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
  const [isLoading, setLoading] = useState(false);
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

    if (
      selectedNetwork.kind !== NetworkKind.Cosmos &&
      selectedNetwork.kind !== NetworkKind.Gno
    ) {
      throw new Error("Only Cosmos or Gno networks are supported");
    }

    let multisigPubkeyJson: string;
    let addrPrefix: string;
    switch (selectedNetwork.kind) {
      case NetworkKind.Cosmos: {
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
        addrPrefix = selectedNetwork.addressPrefix;
        multisigPubkeyJson = JSON.stringify(multisigPubkey);
        break;
      }

      case NetworkKind.Gno: {
        const compressedPubkeys = addressIndexes.map(
          (item) => item.compressedPubkey,
        );
        const mspk = {
          "@type": "/tm.PubKeyMultisig",
          threshold: signatureRequired,
          pubkeys: compressedPubkeys.map((compressedPubkey) => {
            return {
              "@type": "/tm.PubKeySecp256k1",
              value: compressedPubkey,
            };
          }),
        };
        multisigPubkeyJson = JSON.stringify(mspk);
        addrPrefix = "g";
        break;
      }

      default: {
        throw new Error("should not happen");
      }
    }

    try {
      const res = await multisigClient.CreateOrJoinMultisig({
        chainType: selectedNetwork.kind.toLowerCase(),
        authToken,
        chainId: selectedNetwork.chainId,
        bech32Prefix: addrPrefix,
        multisigPubkeyJson,
        name,
      });

      navigation.navigate("MultisigWalletDashboard", {
        id: getUserId(selectedNetwork?.id, res.multisigAddress),
      });
    } catch (err) {
      throw new Error(`Failed to create multisig: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = async (index: number, address: string) => {
    if (!selectedNetwork) {
      throw new Error("No network selected");
    }
    if (
      selectedNetwork.kind !== NetworkKind.Cosmos &&
      selectedNetwork.kind !== NetworkKind.Gno
    ) {
      throw new Error("Only Cosmos or Gno networks are supported");
    }

    const valRes = validateAddress(address);
    if (valRes !== true) {
      return valRes;
    }

    const dcd = bech32.decode(address, 200);
    const prefix = dcd.prefix;
    const addrBz = bech32.fromWords(dcd.words);

    const tempPubkeys = [...addressIndexes];

    try {
      setLoading(true);
      let compressedPubkey: string;
      let kind: string;
      switch (selectedNetwork.kind) {
        case NetworkKind.Cosmos: {
          if (
            addressIndexes.find((a, i) => a.address === address && i !== index)
          ) {
            return "This address is already used in this form.";
          }

          const account = await getCosmosAccount(
            getUserId(selectedNetwork?.id, address),
          );

          if (!account?.pubkey) {
            return "Account has no public key on chain, this address will need to send a transaction before it can be added to a multisig.";
          }
          compressedPubkey = account.pubkey.value;
          kind = "address";
          break;
        }
        case NetworkKind.Gno: {
          switch (prefix) {
            case "g": {
              const client = new GnoJSONRPCProvider(selectedNetwork.endpoint);
              try {
                const account = await client.getAccount(address);
                const pkval = account.BaseAccount.public_key?.value;
                if (!pkval) {
                  return "Account has no public key on chain, this address will need to send a transaction before it can be added to a multisig.";
                }
                compressedPubkey = pkval;
              } catch (err) {
                if (
                  err instanceof Error &&
                  err.message.includes("account is not initialized")
                ) {
                  return "Account has no public key on chain, this address will need to send a transaction before it can be added to a multisig.";
                }
                throw err;
              }
              kind = "address";
              break;
            }
            case "gpub": {
              try {
                const pkany = Any.decode(new Uint8Array(addrBz));
                if (pkany.type_url !== "/tm.PubKeySecp256k1") {
                  return `Invalid pubkey type ${JSON.stringify(pkany.type_url)}`;
                }
                const pk = PubKeySecp256k1.decode(pkany.value);
                compressedPubkey = Buffer.from(pk.key).toString("base64");
                const cosmosPk: Secp256k1Pubkey = {
                  type: "tendermint/PubKeySecp256k1",
                  value: compressedPubkey,
                };
                address = pubkeyToAddress(cosmosPk, "g");
                if (
                  addressIndexes.find(
                    (a, i) => a.address === address && i !== index,
                  )
                ) {
                  return "This address is already used in this form.";
                }
                kind = "pubkey";
              } catch (err) {
                return `Failed to decode pubkey: ${err}`;
              }
              break;
            }
            default: {
              return `Unexpected Bech32 prefix ${JSON.stringify(prefix)}`;
            }
          }
          break;
        }
        default: {
          throw new Error(`should not happen`);
        }
      }

      tempPubkeys[index].address = address;
      tempPubkeys[index].kind = kind;
      tempPubkeys[index].compressedPubkey = compressedPubkey;
      setAddressIndexes(tempPubkeys);
    } catch {
      return "Failed to get Cosmos account";
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer
      headerChildren={<ScreenTitle>Multisig Wallet</ScreenTitle>}
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Multisig")
      }
      isLarge
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: layout.topContentSpacingWithHeading,
        }}
      >
        <View style={{ height: "100%", maxWidth: 793 }}>
          <BrandText style={fontRegular28}>Create a Multisig</BrandText>
          <SpacerColumn size={2.5} />
          <MultisigSection
            title="What is a Multisignature Wallet?"
            containerStyle={{ maxWidth: 487 }}
          >
            <BrandText style={[fontRegular13, { color: neutralA3 }]}>
              This wallet adress is managed by at least 2 different addresses
              and require signatures from co-owners to execute a transaction.
            </BrandText>
          </MultisigSection>
          <SpacerColumn size={3} />
          <TextInputCustom<CreateMultisigWalletFormType>
            name="name"
            control={control}
            variant="labelOutside"
            noBrokenCorners
            label="Multisig name"
            rules={{ required: true }}
            placeHolder="Type the name of the multisig"
            iconSVG={walletInputSVG}
          />
          <SpacerColumn size={3} />

          {addressIndexes.map((val, index) => {
            let label = "Address #" + (index + 1);
            if (val.kind === "pubkey") {
              label += ": " + val.address;
            }
            return (
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
                      label={label}
                      rules={{
                        required: true,
                        validate: (value) => handleAddressChange(index, value),
                      }}
                      disabled={index === 0}
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
            );
          })}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              <BrandText style={[fontRegular14, { color: neutral77 }]}>
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

          <BrandText style={[fontRegular14, { color: neutral77 }]}>
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
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
