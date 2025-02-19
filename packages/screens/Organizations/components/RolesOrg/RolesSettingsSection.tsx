import { useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";
import { Pressable, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { z } from "zod";

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
  RolesFormType,
  zodRoleObject,
} from "@/utils/types/organizations";

interface RolesSettingsSectionProps {
  roles: z.infer<typeof zodRoleObject>[];
  remove: (index?: number | number[] | undefined) => void;
  append: UseFieldArrayAppend<RolesFormType>;
  handleSubmit: () => void;
}

export const RolesSettingsSection: React.FC<RolesSettingsSectionProps> = ({
  roles,
  remove,
  append,
  handleSubmit,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const removeRoleField = (index: number) => {
    remove(index);
  };

  const onOpenModal = () => {
    setModalVisible(true);
  };

  const addRoleField = (name: string, color: string, resources: string[]) => {
    append({
      name,
      color,
      resources,
    });
    setModalVisible(false);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <RolesModalCreateRole
        modalVisible={modalVisible}
        onCloseModal={onCloseModal}
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
              data={roles}
              renderItem={({ item, index }) => {
                const role = item;

                if (!role) {
                  return null;
                }

                return (
                  <View key={item.name} style={{ flex: 1 }}>
                    <RoleTableRow
                      role={{
                        name: role.name || "undefined",
                        color: role.color || "#FFFFFF",
                        resources: role.resources,
                      }}
                      removeRoleField={removeRoleField}
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
        <SpacerColumn size={2.5} />
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
          onPress={handleSubmit}
          testID="roles-settings-next"
        />
      </View>
    </View>
  );
};

const RoleTableRow: React.FC<{
  role: { name: string; color: string; resources: string[] | undefined };
  removeRoleField: (index: number) => void;
  index: number;
}> = ({ role, removeRoleField, index }) => {
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
              removeRoleField(index);
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
