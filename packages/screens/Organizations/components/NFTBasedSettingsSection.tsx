import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { validateAddress } from "../../../utils/formRules";
import {
  neutral17,
  neutral33,
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { NFTSettingFormType } from "../types";

interface Props {
  onSubmit: (form: NFTSettingFormType) => void;
}

export const NFTBasedSettingsSection: React.FC<Props> = ({ onSubmit }) => {
  // variables
  const {
    setValue,
    formState: { isValid },
  } = useForm<NFTSettingFormType>({
    defaultValues: { considerListedNFTs: false },
    mode: "all",
  });
  const { handleSubmit, control } = useForm<NFTSettingFormType>();
  const [contractsIndexes, setContractsIndexes] = useState<number[]>([0]);
  const [considerListedNFTs, setConsiderListedNFTs] = useState(false);

  // Specify considerListedNFTs
  useEffect(() => {
    setValue("considerListedNFTs", considerListedNFTs);
  }, [considerListedNFTs, setValue]);

  // functions
  // const removeContractField = (id: number) => {
  //   if (contractsIndexes.length > 1) {
  //     const copyIndex = [...contractsIndexes].filter((i) => i !== id);
  //     setContractsIndexes(copyIndex);
  //   }
  // };

  const addContractField = () => {
    setContractsIndexes([
      ...contractsIndexes,
      Math.floor(Math.random() * 200000),
    ]);
  };

  // returns
  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandText style={fontSemibold28}>
          Choose your contract settings below
        </BrandText>
        <SpacerColumn size={2.5} />

        <CustomPressable
          style={[
            styles.switchButtonContainer,
            {
              paddingLeft: layout.padding_x2,
              paddingRight: layout.padding_x1_5,
            },
          ]}
          onPress={() =>
            setConsiderListedNFTs((considerListedNFTs) => !considerListedNFTs)
          }
        >
          <BrandText style={fontSemibold14}>
            Consider NFTs listed on the marketplace (but not sold yet) eligible
            to the DAO
          </BrandText>
          {/*TODO: TOggle*/}
          <Switch
            // @ts-expect-error
            activeThumbColor={primaryColor}
            thumbColor={considerListedNFTs ? primaryColor : neutral55}
            trackColor={{ true: secondaryColor, false: neutralA3 }}
            value={considerListedNFTs}
          />
        </CustomPressable>
        <SpacerColumn size={3} />

        <TextInputCustom<NFTSettingFormType>
          name="nftContractAddress"
          noBrokenCorners
          variant="labelOutside"
          label="NFT Collection Contract"
          control={control}
          rules={{ required: true, validate: validateAddress }}
          placeHolder="tori..."
          containerStyle={{ width: "100%" }}
        />

        <SpacerColumn size={2} />

        {/*{contractsIndexes.map((id, index) => (*/}
        {/*  <View style={styles.inputContainer} key={id.toString()}>*/}
        {/*    <TextInputCustom<NFTSettingFormType>*/}
        {/*      name={`contracts.${index}.address`}*/}
        {/*      noBrokenCorners*/}
        {/*      variant="labelOutside"*/}
        {/*      label="NFT Collection Contract"*/}
        {/*      hideLabel={index > 0}*/}
        {/*      control={control}*/}
        {/*      rules={{ required: true, validate: validateAddress }}*/}
        {/*      placeHolder="tori..."*/}
        {/*      containerStyle={{ width: "100%" }}*/}
        {/*    >*/}
        {/*      <Pressable*/}
        {/*        style={styles.trashContainer}*/}
        {/*        onPress={() => removeContractField(id)}*/}
        {/*      >*/}
        {/*        <SVG source={trashSVG} width={12} height={12} />*/}
        {/*      </Pressable>*/}
        {/*    </TextInputCustom>*/}
        {/*  </View>*/}
        {/*))}*/}

        {/*<SecondaryButton size="M" text="Add More" onPress={addContractField} />*/}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          size="M"
          text={`Next: ${ORGANIZATION_DEPLOYER_STEPS[3]}`}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
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

  switchButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: neutral17,
    borderRadius: 12,
    height: 56,
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
    width: "100%",
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
