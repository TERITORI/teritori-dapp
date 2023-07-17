import React, { useState } from "react";
import { View } from "react-native";

import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import {
  secondaryColor,
  neutral33,
  neutral00,
} from "../../../utils/style/colors";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { TextInputCustom } from "../../inputs/TextInputCustom";

export const AddNewSkillCard: React.FC<{
  value?: string;
  onClose: () => void;
  onAdd: (name: string) => void;
}> = ({ value, onClose, onAdd }) => {
  const [skillName, setSkillName] = useState(value ? value : "");

  return (
    <TertiaryBox fullWidth style={{ marginTop: 12 }}>
      <View style={{ width: "100%", padding: 10 }}>
        <TextInputCustom
          label=""
          name="Add Skill"
          placeHolder="Add Skill(e.g. Voice Talent"
          value={skillName}
          style={{ marginTop: 10 }}
          onChangeText={setSkillName}
        />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <SecondaryButton
            size="SM"
            text="Cancel"
            color={secondaryColor}
            backgroundColor={neutral33}
            style={{
              marginRight: 10,
            }}
            onPress={onClose}
          />
          <SecondaryButton
            size="SM"
            text={value ? "Update" : "Add"}
            color={neutral00}
            backgroundColor={secondaryColor}
            style={{ marginLeft: 10 }}
            onPress={() => {
              if (skillName.trim() === "") return;
              onAdd(skillName);
              onClose();
            }}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};
