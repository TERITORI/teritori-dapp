import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import trashSVG from "../../../../../assets/icons/trash.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Box } from "@/components/boxes/Box";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Label, TextInputCustom } from "@/components/inputs/TextInputCustom";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { CheckboxDappStore } from "@/screens/DAppStore/components/CheckboxDappStore";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold18, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  ROLES_BASED_ORGANIZATION_STEPS,
  RolesSettingFormType,
} from "@/utils/types/organizations";

interface RolesSettingsSectionProps {
  onSubmit: (form: RolesSettingFormType) => void;
}

export const RolesSettingsSection: React.FC<RolesSettingsSectionProps> = ({
  onSubmit,
}) => {
  const { handleSubmit, control, unregister, register, setValue, reset } = useForm<RolesSettingFormType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [rolesIndexes, setRolesIndexes] = useState<number[]>([]);
  const [features, setFeatures] = useState<{ name: string, value: boolean }[]>(fakeFeatures);

  const removeRoleField = (id: number, index: number) => {
    console.log(id);
    unregister(`roles.${index}.name`);
    unregister(`roles.${index}.color`);
    unregister(`roles.${index}.features`);
    if (rolesIndexes.length > 0) {
      const copyIndex = [...rolesIndexes].filter((i) => i !== id);;
      setRolesIndexes(copyIndex);
    } reset
  };

  const onOpenModal = () => {
    console.log(rolesIndexes);
    register
    reset();
    setModalVisible(true);
  }

  const addRoleField = () => {
    register(`roles.${rolesIndexes.length}.features`);
    const selectedFeatures = features.filter(f => f.value).map(f => f.name);
    setValue(`roles.${rolesIndexes.length}.features`, selectedFeatures);
    setRolesIndexes([...rolesIndexes, Math.floor(Math.random() * 200000)]);
    setModalVisible(false);
  };

  const onCloseModal = () => {
    reset();
    setModalVisible(false);
  }

  const onCheckboxChange = (index: number) => {
    const copyFeatures = [...features];
    copyFeatures[index].value = !copyFeatures[index].value;
    setFeatures(copyFeatures);
    console.log(features);
  }

  return (
    <View style={{ flex: 1 }}>
      <ModalBase key={modalVisible ? "open" : "closed"} visible={modalVisible} onClose={onCloseModal} width={480} label="Add a new Role">
        <View>
          <TextInputCustom<RolesSettingFormType>
            control={control}
            noBrokenCorners
            name={`roles.${rolesIndexes.length}.name`}
            label="Role name"
            placeholder="Role name"
            rules={{ required: true }}
            placeHolder="Role name"
          />
          <SpacerColumn size={2.5} />
          <TextInputCustom<RolesSettingFormType>
            control={control}
            noBrokenCorners
            name={`roles.${rolesIndexes.length}.color`}
            label="Role color"
            placeholder="Role color"
            placeHolder="Role color"
          />
        </View>
        <SpacerColumn size={2.5} />
        <View>
          <Label>Features & Permissions</Label>
          <Box
            style={{
              borderWidth: 1,
              borderColor: neutral33,
              borderRadius: 8,
              padding: 10,
            }}
          >
            <ScrollView style={{ maxHeight: 180 }}>
              {/* TODO: Refactor Checkbox to make it a global component instead of Dapp!*/}
              {features.map((feature, index) => (
                <View style={{ flex: 1, flexDirection: "row" }} >
                  <TouchableOpacity onPress={() => onCheckboxChange(index)}>
                    <CheckboxDappStore isChecked={feature.value} />
                  </TouchableOpacity>
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold18}>{feature.name}</BrandText>
                  <SpacerColumn size={4} />
                </View>

              ))}
            </ScrollView>
          </Box>
        </View>
        <SpacerColumn size={2.5} />
        <View style={{ alignItems: "center" }}>
          <PrimaryButton
            size="SM"
            text="Add New Role"
            onPress={addRoleField}
          />
        </View>
        <SpacerColumn size={2.5} />
      </ModalBase >
      <ScrollView
        style={{
          padding: layout.contentSpacing,
          paddingRight: layout.spacing_x2_5,
          paddingTop: layout.topContentSpacingWithHeading,
        }}
      >
        <BrandText style={fontSemibold28}>Roles</BrandText>
        <SpacerColumn size={2.5} />

        {rolesIndexes.map((id, index) => (
          <View
            style={{
              flexDirection: "row",
              marginBottom: layout.spacing_x2,
            }}
            key={id.toString()}
          >
            <View style={{ flex: 4 }}>
              <TextInputCustom<RolesSettingFormType>
                control={control}
                noBrokenCorners
                name={`roles.${index}.name`}
                label="Role name"
                placeholder="Role name"
                rules={{ required: true }}
                placeHolder="Role name"
              />
            </View>
            <SpacerRow size={2.5} />
            <View style={{ flex: 2 }}>
              <TextInputCustom<RolesSettingFormType>
                control={control}
                noBrokenCorners
                name={`roles.${index}.color`}
                label="Role color"
                placeholder="Role color"
                placeHolder="Role color"
              />
            </View>
            <SpacerRow size={2.5} />
            <View style={{ flex: 1, alignSelf: "center" }}>
              <Pressable
                onPress={() => {
                  removeRoleField(id, index);
                }}
              >
                <SVG source={trashSVG} width={32} height={32} style={{}} />
              </Pressable>
            </View>
          </View>
        ))}
        <SecondaryButton size="SM" text="Add New Role" onPress={onOpenModal} />
      </ScrollView>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingVertical: layout.spacing_x1_5,
          paddingHorizontal: layout.spacing_x2_5,
          borderTopWidth: 1,
          borderColor: neutral33,
        }}
      >
        <PrimaryButton
          size="M"
          text={`Next: ${ROLES_BASED_ORGANIZATION_STEPS[3]}`}
          onPress={handleSubmit(onSubmit)}
          testID="roles-settings-next"
        />
      </View>
    </View >
  );
};

// TODO: Create a hook to get all the features
const fakeFeatures = [
  { name: "Organizations", value: true },
  { name: "Social Feed", value: false },
  { name: "Marketplace", value: false },
  { name: "Launchpad NFT", value: false },
  { name: "Launchpad ERC20", value: false },
  { name: "Name Service", value: false },
  { name: "Multisig Wallet", value: false },
  { name: "Projects", value: false },
]