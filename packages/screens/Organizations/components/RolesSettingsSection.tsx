import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import trashSVG from "../../../../assets/icons/trash.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  ORGANIZATION_DEPLOYER_STEPS,
  RolesSettingFormType,
} from "@/utils/types/organizations";

interface RolesSettingsSectionProps {
  onSubmit: (form: RolesSettingFormType) => void;
}

export const RolesSettingsSection: React.FC<RolesSettingsSectionProps> = ({
  onSubmit,
}) => {
  const { handleSubmit, control } = useForm<RolesSettingFormType>();

  const [rolesIndexes, setRolesIndexes] = useState<number[]>([]);

  const removeRoleField = (id: number) => {
    if (rolesIndexes.length > 0) {
      const copyIndex = [...rolesIndexes].filter((i) => i !== id);
      setRolesIndexes(copyIndex);
    }
  };

  const addRoleField = () => {
    setRolesIndexes([...rolesIndexes, Math.floor(Math.random() * 200000)]);
  };

  return (
    <View style={{ flex: 1 }}>
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
                  removeRoleField(id);
                }}
              >
                <SVG source={trashSVG} width={32} height={32} style={{}} />
              </Pressable>
            </View>
          </View>
        ))}
        <SecondaryButton size="SM" text="Add New Role" onPress={addRoleField} />
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
          text={`Next: ${ORGANIZATION_DEPLOYER_STEPS[3]}`}
          onPress={handleSubmit(onSubmit)}
          testID="roles-settings-next"
        />
      </View>
    </View>
  );
};
