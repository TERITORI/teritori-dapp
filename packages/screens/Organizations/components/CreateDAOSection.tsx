import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, TextStyle, View, ViewStyle } from "react-native";

import { ImagePreviewer } from "./ImagePreviewer";
import { RadioDescriptionSelector } from "./RadioDescriptionSelector";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { NetworkKind } from "../../../networks";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ORGANIZATION_DEPLOYER_STEPS } from "../OrganizationDeployerScreen";
import { CreateDaoFormType, DaoType } from "../types";

//const RADIO_DESCRIPTION_TYPES = ["Membership", "Governance", "Decentralized"];

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

  // functions
  const onErrorImageLoading = () =>
    setError("imageUrl", {
      type: "pattern",
      message: "This image is invalid",
    });

  // returns
  return (
    <View style={fillStyle}>
      <ScrollView contentContainerStyle={containerStyle}>
        <BrandText style={fontSemibold28}>
          Create a Teritori Organization
        </BrandText>
        <SpacerColumn size={2} />
        <BrandText style={sectionTitleStyle}>Claim a name</BrandText>
        <SpacerColumn size={2.5} />
        <View style={sectionStyle}>
          <ImagePreviewer uri={uri} onError={onErrorImageLoading} />
          <SpacerRow size={2.5} />
          <View style={fillStyle}>
            <View style={rowStyle}>
              <View style={fillStyle}>
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
              <View style={fillStyle}>
                <TextInputCustom<CreateDaoFormType>
                  noBrokenCorners
                  variant="labelOutside"
                  control={control}
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
            />
          </View>
        </View>

        <BrandText style={sectionTitleStyle}>Choose a structure</BrandText>
        <SpacerColumn size={2} />
        <View style={rowStyle}>
          <View style={fillStyle}>
            <RadioDescriptionSelector
              selected={selectedRadioStructure === DaoType.MEMBER_BASED}
              onPress={() => setValue("structure", DaoType.MEMBER_BASED)}
              title="Membership-based TORG - Teritori Organization"
              description="Small organization with a few members who are likely to stick around. Members can be added and removed by a vote of existing members."
            />
          </View>
          <SpacerRow size={2} />
          <View style={fillStyle}>
            <RadioDescriptionSelector
              disabled
              selected={selectedRadioStructure === DaoType.TOKEN_BASED}
              onPress={() => setValue("structure", DaoType.TOKEN_BASED)}
              title="Governance Token-based TORG - Teritori Organization"
              description="Fluid organization with many members who leave and join frequently. Members can join and leave by exchanging governance shares."
            />
          </View>
        </View>
        <SpacerColumn size={2} />
      </ScrollView>

      <View style={footerStyle}>
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

const containerStyle: ViewStyle = {
  padding: layout.contentPadding,
  paddingRight: layout.padding_x2_5,
  paddingTop: layout.topContentPaddingWithHeading,
};
const sectionTitleStyle: TextStyle = {
  ...fontSemibold20,
  color: neutral77,
};
const sectionStyle: ViewStyle = {
  borderRadius: 12,
  borderColor: neutral33,
  borderWidth: 1,
  padding: layout.padding_x2_5,
  flexDirection: "row",
  marginBottom: layout.padding_x4,
};
const rowStyle: ViewStyle = { flexDirection: "row" };
const fillStyle: ViewStyle = { flex: 1 };

const footerStyle: ViewStyle = {
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingVertical: layout.padding_x1_5,
  paddingHorizontal: layout.padding_x2_5,
  borderTopWidth: 1,
  borderColor: neutral33,
};
