import { Control } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Box } from "@/components/boxes/Box";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Label, TextInputCustom } from "@/components/inputs/TextInputCustom";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { CheckboxDappStore } from "@/screens/DAppStore/components/CheckboxDappStore";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold18 } from "@/utils/style/fonts";
import { RolesSettingFormType } from "@/utils/types/organizations";

interface RolesModalCreateRoleProps {
  modalVisible: boolean;
  rolesIndexes: number[];
  resources: { name: string; resources: string[]; value: boolean }[];
  control: Control<RolesSettingFormType>;
  onCloseModal: () => void;
  onCheckboxChange: (index: number) => void;
  addRoleField: () => void;
}

export const RolesModalCreateRole: React.FC<RolesModalCreateRoleProps> = ({
  modalVisible,
  rolesIndexes,
  resources,
  control,
  onCloseModal,
  onCheckboxChange,
  addRoleField,
}) => {
  return (
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
        <Label>Resources & Permissions</Label>
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
  );
};
