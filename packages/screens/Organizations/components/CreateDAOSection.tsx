import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import { ImagePreviewer } from "./ImagePreviewer";
import { RadioDescriptionSelector } from "./RadioDescriptionSelector";
import { BrandText } from "../../../components/BrandText";
import { NetworkIcon } from "../../../components/NetworkIcon";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import {
  SelectInput,
  SelectInputData,
} from "../../../components/inputs/SelectInput";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { selectableCosmosNetworks } from "../../../networks";
import { NetworkKind } from "../../../networks";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { CreateDaoFormType, DaoType } from "../types";

interface CreateDAOSectionProps {
  onSubmit: (form: CreateDaoFormType) => void;
}

export const CreateDAOSection: React.FC<CreateDAOSectionProps> = ({
  onSubmit,
}) => {
  // variables
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isValid },
  } = useForm<CreateDaoFormType>({
    defaultValues: { structure: DaoType.MEMBER_BASED },
    mode: "all",
  });

  const selectedNetwork = useSelectedNetworkInfo();
  const selectedRadioStructure = watch("structure");
  const uri = watch("imageUrl");
  const name = watch("associatedTeritoriNameService");

  const selectedNetworkInfo = useSelectedNetworkInfo();
  const [selectedInputData, setSelectedInputData] = useState<SelectInputData>({
    label: selectedNetworkInfo?.displayName || "",
    value: selectedNetworkInfo?.id || "",
    iconComponent: (
      <NetworkIcon networkId={selectedNetworkInfo?.id} size={16} />
    ),
  });

  // functions
  const onErrorImageLoading = () =>
    setError("imageUrl", {
      type: "pattern",
      message: "This image is invalid",
    });

  // returns
  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={styles.container}>
        <BrandText style={fontSemibold28}>
          Create a Teritori Organization
        </BrandText>
        <SpacerColumn size={2} />
        <BrandText style={styles.sectionTitle}>Claim a name</BrandText>
        <SpacerColumn size={2.5} />
        <View style={styles.section}>
          <ImagePreviewer uri={uri} onError={onErrorImageLoading} />
          <SpacerRow size={2.5} />
          <View style={styles.fill}>
            <View style={styles.row}>
              <View style={styles.fill}>
                <TextInputCustom<CreateDaoFormType>
                  noBrokenCorners
                  height={48}
                  control={control}
                  variant="labelOutside"
                  label="Organization's name"
                  placeHolder="Type organization's name here"
                  name="organizationName"
                  rules={{ required: true }}
                />
              </View>
              <SpacerRow size={2.5} />
              <View style={styles.fill}>
                <TextInputCustom<CreateDaoFormType>
                  noBrokenCorners
                  height={48}
                  control={control}
                  variant="labelOutside"
                  label={`Associated Handle${
                    name
                      ? `: ${name}${
                        selectedNetwork?.kind === NetworkKind.Gno
                          ? ""
                          : ".tori"
                      }`
                      : ""
                  }`}
                  placeHolder={
                    selectedNetwork?.kind === NetworkKind.Gno
                      ? "your_organization"
                      : "your-organization"
                  }
                  name="associatedTeritoriNameService"
                  rules={{ required: true }}
                />
              </View>
              <SpacerRow size={2.5} />
              {/*TODO: Add more networks later*/}
              <SelectInput
                disabled // TODO: Enable and plug later
                style={{ width: 251 }}
                data={selectableCosmosNetworks.map((n) => {
                  return {
                    label: n.displayName,
                    value: n.id,
                    iconComponent: <NetworkIcon networkId={n?.id} size={16} />,
                  };
                })}
                selectedData={selectedInputData}
                setData={(d: SelectInputData) => {
                  setSelectedInputData(d);
                }}
                label="Network"
                isRequired
              />
            </View>
            <View style={{ zIndex: -1 }}>
              <SpacerColumn size={2.5} />
              <TextInputCustom<CreateDaoFormType>
                noBrokenCorners
                height={48}
                control={control}
                variant="labelOutside"
                label="Organization's image url"
                placeHolder="https://example.com/preview.png"
                name="imageUrl"
                rules={{ required: true }}
              />
              <SpacerColumn size={2.5} />
              <TextInputCustom<CreateDaoFormType>
                noBrokenCorners
                control={control}
                variant="labelOutside"
                label="Organization's description"
                placeHolder="Type organization's description here"
                name="organizationDescription"
                rules={{ required: true }}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        <BrandText style={styles.sectionTitle}>Choose a structure</BrandText>
        <SpacerColumn size={2} />
        <View style={styles.row}>
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={selectedRadioStructure === DaoType.MEMBER_BASED}
              onPress={() => setValue("structure", DaoType.MEMBER_BASED)}
              title="Membership-based TORG - Teritori Organization"
              description={`Small organization with a few members who are likely to stick around.\nMembers can be added and removed by a vote of existing members.`}
            />
          </View>
          <SpacerRow size={2} />
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={selectedRadioStructure === DaoType.TOKEN_BASED}
              onPress={() => setValue("structure", DaoType.TOKEN_BASED)}
              title="Governance Token-based TORG - Teritori Organization"
              description={`Fluid organization with many members who leave and join frequently.\nMembers can join and leave by exchanging governance shares.`}
            />
          </View>
        </View>
        <SpacerColumn size={2} />

        <View style={styles.row}>
          <View style={styles.fill}>
            <RadioDescriptionSelector
              disabled
              selected={selectedRadioStructure === DaoType.COOP_BASED}
              onPress={() => setValue("structure", DaoType.COOP_BASED)}
              title="Decentralized Coop Org (Coming Soon)"
              description={`A cooperative company is based on a simple rule: 1 people = 1 voice,\nwhatever the number of holded tokens.`}
              style={{ height: "100%" }}
            />
          </View>
          <SpacerRow size={2} />
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={selectedRadioStructure === DaoType.NFT_BASED}
              onPress={() => setValue("structure", DaoType.NFT_BASED)}
              title="NFT token-gated TORG - Teritori Organization "
              description={`Fluid organization with many members who leave and join frequently\nMembers can join and leave by holding one or multiple NFTs.`}
            />
          </View>
        </View>
        <SpacerColumn size={2} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          size="M"
          text={`Next: ${ORGANIZATION_DEPLOYER_STEPS[1]}`}
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
  sectionTitle: StyleSheet.flatten([fontSemibold20, { color: neutral77 }]),
  section: {
    borderRadius: 12,
    borderColor: neutral33,
    borderWidth: 1,
    padding: layout.padding_x2_5,
    flexDirection: "row",
    marginBottom: layout.padding_x4,
  },
  row: { flexDirection: "row" },
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
