import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ImagePreviewer } from "./ImagePreviewer";
import { RadioDescriptionSelector } from "./RadioDescriptionSelector";
import { BrandText } from "../../../components/BrandText";
import { NetworkIcon } from "../../../components/NetworkIcon";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { FileUploader } from "../../../components/fileUploader";
import { SearchNSInputContainer } from "../../../components/inputs/SearchNSInputContainer";
import {
  SelectInput,
  SelectInputData,
} from "../../../components/inputs/SelectInput";
import {
  Label,
  TextInputCustom,
} from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useNSNameOwner } from "../../../hooks/useNSNameOwner";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getNetwork, NetworkKind } from "../../../networks";
import { gnoDevNetwork } from "../../../networks/gno-dev";
import { gnoTeritoriNetwork } from "../../../networks/gno-teritori";
import { teritoriNetwork } from "../../../networks/teritori";
import { teritoriTestnetNetwork } from "../../../networks/teritori-testnet";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import {
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { nsTokenWithoutTLD } from "../../../utils/tns";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { CreateDaoFormType, DaoType } from "../types";

interface CreateDAOSectionProps {
  onSubmit: (form: CreateDaoFormType) => void;
}

export const CreateDAOSection: React.FC<CreateDAOSectionProps> = ({
  onSubmit,
}) => {
  const selectedWallet = useSelectedWallet();

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
  const structure = watch("structure");
  const image = watch("image");
  const associatedTeritoriNameService = watch("associatedTeritoriNameService");

  // Networks concerned by the feature //TODO: Add more later
  const networks = [
    teritoriNetwork,
    teritoriTestnetNetwork,
    gnoTeritoriNetwork,
    gnoDevNetwork,
  ];
  // Networks selectable in the SelectInput
  const selectableNetworks = networks.map((n) => {
    return {
      label: n.displayName,
      value: n.id,
      iconComponent: <NetworkIcon networkId={n?.id} size={16} />,
    };
  });
  // Default network in the SelectInput
  const dappSelectedNetworkInfo = useSelectedNetworkInfo();
  const [selectedNetwork, setSelectedNetwork] = useState<SelectInputData>({
    label: dappSelectedNetworkInfo?.displayName || "",
    value: dappSelectedNetworkInfo?.id || "",
    iconComponent: (
      <NetworkIcon networkId={dappSelectedNetworkInfo?.id} size={16} />
    ),
  });
  const selectedNetworkInfo = getNetwork(selectedNetwork?.value.toString());

  // Specify networkId
  useEffect(() => {
    setValue("networkId", selectedNetwork.value.toString());
  }, [selectedNetwork, setValue]);

  // Reset the SearchNSInputContainer searchText to hide the list of the found names
  const [selectedName, setSelectedName] = useState("");
  useEffect(() => {
    if (associatedTeritoriNameService !== selectedName) setSelectedName("");
  }, [associatedTeritoriNameService, selectedName]);

  // Check if the selectedName is already owned by another user
  const {
    nameOwner,
    notFound,
    isLoading: nsNameOwnerLoading,
  } = useNSNameOwner(
    selectedNetwork.value.toString(),
    (
      associatedTeritoriNameService +
      (selectedNetworkInfo?.kind === NetworkKind.Cosmos
        ? selectedNetworkInfo?.nameServiceTLD
        : "")
    ).toLowerCase()
  );
  const isNameAvailable = useMemo(
    () =>
      (!notFound && nameOwner === selectedWallet?.address) ||
      notFound ||
      !associatedTeritoriNameService,
    [
      notFound,
      nameOwner,
      selectedWallet?.address,
      associatedTeritoriNameService,
    ]
  );

  // Specify if associatedTeritoriNameService is an existing name held by the user. This name will not be minted ah the DAO creation
  useEffect(() => {
    setValue("userOwnsName", !!selectedName);
  }, [selectedName, setValue]);

  const onErrorImageLoading = () =>
    setError("image", {
      type: "pattern",
      message: "This image is invalid",
    });

  const [isImageHovered, setImageHovered] = useState(false);

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
          <CustomPressable
            onHoverOut={() => setImageHovered(false)}
            onHoverIn={() => setImageHovered(true)}
          >
            <Label
              style={{ color: isImageHovered ? secondaryColor : neutralA3 }}
              isRequired
            >
              Organization's image
            </Label>
            <SpacerColumn size={1.5} />
            <FileUploader
              onUpload={(files) => setValue("image", files?.[0])}
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <TouchableOpacity onPress={onPress}>
                  <ImagePreviewer
                    uri={image?.url}
                    onError={onErrorImageLoading}
                    style={isImageHovered && { borderColor: secondaryColor }}
                  />
                </TouchableOpacity>
              )}
            </FileUploader>
          </CustomPressable>

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

              <SelectInput
                style={{ width: 251 }}
                data={selectableNetworks}
                selectedData={selectedNetwork}
                selectData={(d: SelectInputData) => {
                  setSelectedNetwork(d);
                }}
                label="Network"
                isRequired
                boxStyle={{ height: 48 }}
              />
              <SpacerRow size={2.5} />
              <View style={styles.fill}>
                <SearchNSInputContainer
                  onPressName={(userId, name) => {
                    if (name && isNameAvailable) {
                      setValue(
                        "associatedTeritoriNameService",
                        nsTokenWithoutTLD(name)
                      );
                      setSelectedName(nsTokenWithoutTLD(name));
                    }
                  }}
                  networkId={selectedNetworkInfo?.id}
                  ownerAddress={selectedWallet?.address}
                  searchText={selectedName ? "" : associatedTeritoriNameService}
                >
                  <TextInputCustom<CreateDaoFormType>
                    error={
                      !isNameAvailable && !nsNameOwnerLoading
                        ? "This name is already owned"
                        : undefined
                    }
                    noBrokenCorners
                    height={48}
                    control={control}
                    variant="labelOutside"
                    label={`Associated Handle${
                      associatedTeritoriNameService
                        ? `: ${associatedTeritoriNameService}${
                            selectedNetworkInfo?.kind === NetworkKind.Gno
                              ? ""
                              : ".tori"
                          }`
                        : ""
                    }`}
                    placeHolder={
                      selectedNetworkInfo?.kind === NetworkKind.Gno
                        ? "your_organization"
                        : "your-organization"
                    }
                    name="associatedTeritoriNameService"
                    rules={{ required: true }}
                  />
                </SearchNSInputContainer>
              </View>
            </View>
            <View style={{ zIndex: -1 }}>
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
              selected={structure === DaoType.MEMBER_BASED}
              onPress={() => setValue("structure", DaoType.MEMBER_BASED)}
              title="Membership-based TORG - Teritori Organization"
              description={`Small organization with a few members who are likely to stick around.\nMembers can be added and removed by a vote of existing members.`}
            />
          </View>
          <SpacerRow size={2} />
          <View style={styles.fill}>
            <RadioDescriptionSelector
              disabled
              selected={structure === DaoType.TOKEN_BASED}
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
              selected={structure === DaoType.COOP_BASED}
              onPress={() => setValue("structure", DaoType.COOP_BASED)}
              title="Decentralized Coop Org (Coming Soon)"
              description={`A cooperative company is based on a simple rule: 1 people = 1 voice,\nwhatever the number of holded tokens.`}
              style={{ height: "100%" }}
            />
          </View>
          <SpacerRow size={2} />
          <View style={styles.fill}>
            <RadioDescriptionSelector
              selected={structure === DaoType.NFT_BASED}
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
          disabled={!isValid || !image || !isNameAvailable}
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
