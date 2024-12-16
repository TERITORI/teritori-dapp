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
  const { handleSubmit, control, unregister, register, setValue, resetField } =
    useForm<RolesSettingFormType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [rolesIndexes, setRolesIndexes] = useState<number[]>([]);
  const [resources, setResources] =
    useState<{ name: string; resources: string[]; value: boolean }[]>(
      fakeResources,
    );

  const removeRoleField = (id: number, index: number) => {
    unregister(`roles.${index}.name`);
    unregister(`roles.${index}.color`);
    unregister(`roles.${index}.resources`);
    if (rolesIndexes.length > 0) {
      const copyIndex = [...rolesIndexes].filter((i) => i !== id);
      setRolesIndexes(copyIndex);
    }
  };

  const resetModal = () => {
    resetField(`roles.${rolesIndexes.length}.name`);
    resetField(`roles.${rolesIndexes.length}.color`);
    resetField(`roles.${rolesIndexes.length}.resources`);
  };

  const onOpenModal = () => {
    resetModal();
    setResources(fakeResources.map((r) => ({ ...r, value: false })));
    setModalVisible(true);
  };

  const addRoleField = () => {
    register(`roles.${rolesIndexes.length}.resources`);
    const selectedResources = resources
      .filter((r) => r.value)
      .flatMap((r) => r.resources);
    setValue(`roles.${rolesIndexes.length}.resources`, selectedResources);
    console.log(`Selected resources: ${selectedResources}`);
    setRolesIndexes([...rolesIndexes, Math.floor(Math.random() * 200000)]);
    setModalVisible(false);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  const onCheckboxChange = (index: number) => {
    const copyResources = [...resources];
    copyResources[index].value = !copyResources[index].value;
    setResources(copyResources);
  };

  return (
    <View style={{ flex: 1 }}>
      <ModalBase
        key={modalVisible ? "open" : "closed"}
        visible={modalVisible}
        onClose={onCloseModal}
        width={480}
        label="Add a new Role"
      >
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
              {resources.map((resource, index) => (
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => onCheckboxChange(index)}>
                    <CheckboxDappStore isChecked={resource.value} />
                  </TouchableOpacity>
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold18}>{resource.name}</BrandText>
                  <SpacerColumn size={4} />
                </View>
              ))}
            </ScrollView>
          </Box>
        </View>
        <SpacerColumn size={2.5} />
        <View style={{ alignItems: "center" }}>
          <PrimaryButton size="SM" text="Add New Role" onPress={addRoleField} />
        </View>
        <SpacerColumn size={2.5} />
      </ModalBase>
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
    </View>
  );
};

// TODO: Create a hook to get all the resources
const fakeResources = [
  {
    name: "Organizations",
    resources: [],
    value: false,
  },
  {
    name: "Social Feed",
    resources: ["gno.land/r/teritori/social_feeds.CreatePost"],
    value: false,
  },
  {
    name: "Marketplace",
    resources: [],
    value: false,
  },
  {
    name: "Launchpad NFT",
    resources: [],
    value: false,
  },
  {
    name: "Launchpad ERC20",
    resources: [],
    value: false,
  },
  {
    name: "Name Service",
    resources: [],
    value: false,
  },
  {
    name: "Multisig Wallet",
    resources: [],
    value: false,
  },
  {
    name: "Projects",
    resources: [],
    value: false,
  },
];
