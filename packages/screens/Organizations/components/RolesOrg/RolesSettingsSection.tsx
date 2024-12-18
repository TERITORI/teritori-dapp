import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { RolesModalCreateRole } from "./RolesModalCreateRole";
import trashSVG from "../../../../../assets/icons/trash.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SpacerColumn } from "@/components/spacer";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";
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
  const {
    handleSubmit,
    control,
    unregister,
    register,
    setValue,
    resetField,
    getValues,
  } = useForm<RolesSettingFormType>();
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
      <RolesModalCreateRole
        modalVisible={modalVisible}
        rolesIndexes={rolesIndexes}
        resources={resources}
        control={control}
        onCloseModal={onCloseModal}
        onCheckboxChange={onCheckboxChange}
        addRoleField={addRoleField}
      />
      <ScrollView
        style={{
          padding: layout.contentSpacing,
          paddingRight: layout.spacing_x2_5,
          paddingTop: layout.topContentSpacingWithHeading,
        }}
      >
        <BrandText style={fontSemibold28}>Roles</BrandText>
        <SpacerColumn size={2.5} />

        <View
          style={{
            width: "100%",
            maxWidth: screenContentMaxWidthLarge,
          }}
        >
          <BrandText>Roles table</BrandText>
          <SpacerColumn size={2} />
          <TableWrapper horizontalScrollBreakpoint={800}>
            <TableHeader columns={columns} />
            <FlatList
              data={rolesIndexes}
              renderItem={({ item, index }) => {
                const role = getValues(`roles.${index}`);

                if (!role) {
                  return null;
                }

                return (
                  <View key={item} style={{ flex: 1 }}>
                    <RoleTableRow
                      role={{
                        name: role.name || "undefined",
                        color: role.color || "#FFFFFF",
                        resources: role.resources,
                      }}
                      removeRoleField={removeRoleField}
                      id={item}
                      index={index}
                    />
                    <SpacerColumn size={1} />
                  </View>
                );
              }}
              keyExtractor={(item) => item.toString()}
            />
          </TableWrapper>
        </View>
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

const RoleTableRow: React.FC<{
  role: { name: string; color: string; resources: string[] | undefined };
  removeRoleField: (id: number, index: number) => void;
  id: number;
  index: number;
}> = ({ role, removeRoleField, id, index }) => {
  return (
    <TableRow>
      <TableTextCell
        style={{
          minWidth: columns.name.minWidth,
          flex: columns.name.flex,
        }}
      >
        {role.name}
      </TableTextCell>
      <TableTextCell
        style={{
          minWidth: columns.color.minWidth,
          flex: columns.color.flex,
        }}
      >
        {role.color}
      </TableTextCell>
      <TableTextCell
        style={{
          minWidth: columns.resources.minWidth,
          flex: columns.resources.flex,
        }}
      >
        {role.resources?.join(", ") || "No resources defined"}
      </TableTextCell>
      <TableCell
        style={{
          minWidth: columns.delete.minWidth,
          flex: columns.delete.flex,
        }}
      >
        <View>
          <Pressable
            onPress={() => {
              removeRoleField(id, index);
            }}
          >
            <SVG source={trashSVG} width={32} height={32} style={{}} />
          </Pressable>
        </View>
      </TableCell>
    </TableRow>
  );
};

const columns: TableColumns = {
  name: {
    label: "Name",
    flex: 1,
    minWidth: 120,
  },
  color: {
    label: "Color",
    flex: 1,
    minWidth: 60,
  },
  resources: {
    label: "Resources",
    flex: 1.5,
    minWidth: 150,
  },
  delete: {
    label: "Delete",
    flex: 0.25,
    minWidth: 30,
  },
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
