import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

import {
  MintState,
  Sort,
  SortDirection,
} from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import {
  SelectInput,
  SelectInputData,
} from "../../../components/inputs/SelectInput";
import { SpacerColumn } from "../../../components/spacer";
import { useCollections } from "../../../hooks/useCollections";
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
  networkId?: string;
}

export const NFTBasedSettingsSection: React.FC<Props> = ({
  onSubmit,
  networkId,
}) => {
  // variables
  const {
    setValue,
    formState: { isValid },
    handleSubmit,
  } = useForm<NFTSettingFormType>({
    defaultValues: { considerListedNFTs: false },
    mode: "all",
  });
  const [considerListedNFTs, setConsiderListedNFTs] = useState(false);
  const { collections } = useCollections({
    networkId: networkId!,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    upcoming: false,
    sort: Sort.SORT_UNSPECIFIED,
    limit: 1000,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  });
  const selectableContracts: SelectInputData[] = useMemo(
    () =>
      collections.map((c) => {
        return {
          label: `${c.collectionName} - ${c.mintAddress}`,
          value: c.mintAddress,
        };
      }),
    [collections]
  );
  const [selectedContract, setSelectedContract] = useState<SelectInputData>({
    label: "",
    value: "",
  });

  // Specify nftContractAddress
  useEffect(() => {
    setValue("nftContractAddress", selectedContract.value.toString());
  }, [selectedContract.value, setValue]);

  // Specify considerListedNFTs
  useEffect(() => {
    setValue("considerListedNFTs", considerListedNFTs);
  }, [considerListedNFTs, setValue]);

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

        <SelectInput
          data={selectableContracts}
          selectedData={selectedContract}
          selectData={setSelectedContract}
          label="NFT Collection Contract"
          name="nftContractAddress"
          placeHolder="tori..."
          isRequired
          allowEnteringValue
        />
        <SpacerColumn size={2} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          size="M"
          text={`Next: ${ORGANIZATION_DEPLOYER_STEPS[3]}`}
          onPress={handleSubmit(onSubmit)}
          disabled={
            !isValid ||
            !selectedContract.value ||
            !validateAddress(selectedContract.value.toString())
          }
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
