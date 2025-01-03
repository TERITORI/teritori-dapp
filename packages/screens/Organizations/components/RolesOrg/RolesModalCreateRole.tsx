import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Checkbox } from "@/components/Checkbox";
import { Box } from "@/components/boxes/Box";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Label, TextInputCustom } from "@/components/inputs/TextInputCustom";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold18 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { RoleFormType, zodRoleObject } from "@/utils/types/organizations";

interface RolesModalCreateRoleProps {
  modalVisible: boolean;
  onCloseModal: () => void;
  addRoleField: (name: string, color: string, resources: string[]) => void;
}

export const RolesModalCreateRole: React.FC<RolesModalCreateRoleProps> = ({
  modalVisible,
  onCloseModal,
  addRoleField,
}) => {
  const { control, handleSubmit, reset } = useForm<RoleFormType>({
    resolver: zodResolver(zodRoleObject),
  });

  const getInitialState = () => {
    return fakeResources.map((fakeResource) => ({
      ...fakeResource,
      value: false,
    }));
  };
  const [resources, setResources] =
    useState<{ name: string; resources: string[]; value: boolean }[]>(
      getInitialState(),
    );

  const onCheckboxChange = (index: number) => {
    const copyResources = [...resources];
    copyResources[index].value = !copyResources[index].value;
    setResources(copyResources);
  };

  return (
    <ModalBase
      key={modalVisible ? "open" : "closed"}
      visible={modalVisible}
      onClose={() => {
        onCloseModal();
        setResources(getInitialState());
      }}
      width={480}
      label="Add a new Role"
    >
      <View>
        <TextInputCustom<RoleFormType>
          control={control}
          name="name"
          noBrokenCorners
          label="Role name"
          placeholder="Role name"
          rules={{ required: true }}
          placeHolder="Role name"
        />
        <SpacerColumn size={2.5} />
        <TextInputCustom<RoleFormType>
          control={control}
          noBrokenCorners
          name="color"
          label="Role color"
          placeholder="Role color"
          placeHolder="Role color"
        />
      </View>
      <SpacerColumn size={2.5} />
      <View>
        <Label style={{ marginBottom: layout.spacing_x1_5 }}>
          Resources & Permissions
        </Label>
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
                  <Checkbox isChecked={resource.value} />
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
        <PrimaryButton
          size="SM"
          text="Add New Role"
          onPress={handleSubmit((data: RoleFormType) => {
            let finalResources: string[] | undefined = [];
            resources.forEach((resource) => {
              if (resource.value === true) {
                finalResources = finalResources?.concat(resource.resources);
              }
            });
            setResources(getInitialState());
            addRoleField(data.name, data.color, finalResources);
            reset();
          })}
        />
      </View>
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

// TODO: Create a hook to get all the resources
const fakeResources = [
  {
    name: "Organizations",
    resources: [],
  },
  {
    name: "Social Feed",
    resources: ["gno.land/r/teritori/social_feeds.CreatePost"],
  },
  {
    name: "Marketplace",
    resources: [],
  },
  {
    name: "Launchpad NFT",
    resources: [],
  },
  {
    name: "Launchpad ERC20",
    resources: [],
  },
  {
    name: "Name Service",
    resources: [],
  },
  {
    name: "Multisig Wallet",
    resources: [],
  },
  {
    name: "Projects",
    resources: [],
  },
];
