import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, TextStyle, View, ViewStyle } from "react-native";

import { ImagePreviewer } from "./ImagePreviewer";
import { RadioDescriptionSelector } from "./RadioDescriptionSelector";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AvailableNamesInput } from "@/components/inputs/AvailableNamesInput";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useDeveloperMode } from "@/hooks/useDeveloperMode";
import { useNSAvailability } from "@/hooks/useNSAvailability";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { neutral33, neutral77 } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CreateDaoFormType,
  DaoType,
  ORGANIZATION_DEPLOYER_STEPS,
} from "@/utils/types/organizations";

//const RADIO_DESCRIPTION_TYPES = ["Membership", "Governance", "Decentralized"];

interface CreateDAOSectionProps {
  onSubmit: (form: CreateDaoFormType) => void;
  onStructureChange: (structure: DaoType) => void;
}

export const CreateDAOSection: React.FC<CreateDAOSectionProps> = ({
  onSubmit,
  onStructureChange,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isValid },
  } = useForm<CreateDaoFormType>({
    defaultValues: {
      structure: DaoType.MEMBER_BASED,
    },
    mode: "all",
  });

  const selectedNetwork = useSelectedNetworkInfo();
  const selectedRadioStructure = watch("structure");
  const uri = watch("imageUrl");
  const name = watch("associatedHandle");
  const [isDev] = useDeveloperMode();

  const nameAvailability = useNSAvailability(selectedNetwork?.id, name);

  useEffect(() => {
    setValue("nameAvailability", nameAvailability);
  }, [setValue, nameAvailability]);

  // functions
  const onErrorImageLoading = () =>
    setError("imageUrl", { type: "pattern", message: "This image is invalid" });

  const onStructureChangeHandler = (structure: DaoType) => {
    setValue("structure", structure);
    onStructureChange(structure);
  };

  return (
    <View style={fillCStyle}>
      <ScrollView contentContainerStyle={containerCStyle}>
        <BrandText style={fontSemibold28}>
          Create a Teritori Organization
        </BrandText>
        <SpacerColumn size={2} />
        <BrandText style={sectionTitleCStyle}>Claim a name</BrandText>
        <SpacerColumn size={2.5} />
        <View style={sectionCStyle}>
          <ImagePreviewer uri={uri} onError={onErrorImageLoading} />
          <SpacerRow size={2.5} />
          <View style={fillCStyle}>
            <View style={rowCStyle}>
              <View style={fillCStyle}>
                <TextInputCustom<CreateDaoFormType>
                  noBrokenCorners
                  variant="labelOutside"
                  control={control}
                  label="Organization's name"
                  placeHolder="Type organization's name here"
                  name="organizationName"
                  rules={{ required: true }}
                />
              </View>
              <SpacerRow size={2.5} />
              <View style={fillCStyle}>
                <AvailableNamesInput
                  nameValue={name}
                  onChangeText={(val: string) => {
                    setValue("associatedHandle", val, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  label="Associated Handle"
                  name="associatedHandle"
                  control={control}
                  placeHolder={
                    selectedNetwork?.kind === NetworkKind.Gno
                      ? "your_organization"
                      : "your-organization"
                  }
                  value={name}
                />
              </View>
            </View>

            <SpacerColumn size={2.5} />
            <TextInputCustom<CreateDaoFormType>
              noBrokenCorners
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
              variant="labelOutside"
              control={control}
              label="Organization's description"
              placeHolder="Type organization's description here"
              name="organizationDescription"
              rules={{ required: true }}
              // isAsterickSign
              multiline
              numberOfLines={3}
              testID="organization-description"
            />
          </View>
        </View>

        <BrandText style={sectionTitleCStyle}>Choose a structure</BrandText>
        <SpacerColumn size={2} />
        <View style={rowCStyle}>
          <View style={fillCStyle}>
            <RadioDescriptionSelector
              selected={selectedRadioStructure === DaoType.MEMBER_BASED}
              onPress={() => onStructureChangeHandler(DaoType.MEMBER_BASED)}
              title="Membership-based TORG - Teritori Organization"
              description="Small organization with a few members who are likely to stick around. Members can be added and removed by a vote of existing members."
            />
          </View>
          <SpacerRow size={2} />
          <View style={fillCStyle}>
            <RadioDescriptionSelector
              disabled
              selected={selectedRadioStructure === DaoType.TOKEN_BASED}
              onPress={() => onStructureChangeHandler(DaoType.TOKEN_BASED)}
              title="Governance Token-based TORG - Teritori Organization"
              description="Fluid organization with many members who leave and join frequently. Members can join and leave by exchanging governance shares."
            />
          </View>
        </View>
        <SpacerColumn size={2} />
        <View style={rowCStyle}>
          <View style={halfRowFlexCStyle}>
            <RadioDescriptionSelector
              disabled={!isDev}
              selected={selectedRadioStructure === DaoType.ROLES_BASED}
              onPress={() => onStructureChangeHandler(DaoType.ROLES_BASED)}
              title="Roles-based TORG - Teritori Organization"
              description="Organization where members have roles and permissions. Roles can be assigned and removed through a vote of existing members."
            />
          </View>
          <SpacerRow size={2} />
        </View>
        <SpacerColumn size={2} />
      </ScrollView>

      <View style={footerCStyle}>
        <PrimaryButton
          size="M"
          text={`Next: ${ORGANIZATION_DEPLOYER_STEPS[1]}`}
          onPress={handleSubmit(onSubmit)}
          disabled={
            !isValid ||
            (selectedNetwork?.kind === NetworkKind.Cosmos &&
              !["mint"].includes(nameAvailability.availability))
          }
        />
      </View>
    </View>
  );
};

const containerCStyle: ViewStyle = {
  padding: layout.contentSpacing,
  paddingRight: layout.spacing_x2_5,
  paddingTop: layout.topContentSpacingWithHeading,
};

const sectionTitleCStyle: TextStyle = { ...fontSemibold20, color: neutral77 };

const sectionCStyle: ViewStyle = {
  borderRadius: 12,
  borderColor: neutral33,
  borderWidth: 1,
  padding: layout.spacing_x2_5,
  flexDirection: "row",
  marginBottom: layout.spacing_x4,
};
const rowCStyle: ViewStyle = { flexDirection: "row" };

const fillCStyle: ViewStyle = { flex: 1 };

const halfRowFlexCStyle: ViewStyle = { flex: 0.5 };

const footerCStyle: ViewStyle = {
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingVertical: layout.spacing_x1_5,
  paddingHorizontal: layout.spacing_x2_5,
  borderTopWidth: 1,
  borderColor: neutral33,
};
