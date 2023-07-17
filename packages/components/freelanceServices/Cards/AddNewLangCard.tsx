import React, { useState } from "react";
import { View } from "react-native";

import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { LangInfo } from "../../../screens/FreelanceServices/types/fields";
import {
  secondaryColor,
  neutral33,
  neutral00,
} from "../../../utils/style/colors";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { TextComboBox } from "../../inputs/TextComboBox";
import { TextInputCustom } from "../../inputs/TextInputCustom";

export const AddNewLangCard: React.FC<{
  value?: LangInfo;
  onClose: () => void;
  onAdd: (name: string, level: string) => void;
}> = ({ value, onClose, onAdd }) => {
  const [langName, setLangName] = useState(value ? value.name : "");
  const [langLevel, setLangLevel] = useState(value ? value.level : "basic");

  return (
    <TertiaryBox fullWidth style={{ marginTop: 12, zIndex: 1 }}>
      <View style={{ width: "100%", padding: 10 }}>
        <TextInputCustom
          label=""
          name="Add Language"
          placeHolder="Add Language"
          value={langName}
          style={{ marginTop: 10 }}
          onChangeText={setLangName}
        />
        <TextComboBox
          options={[
            { value: "basic", label: "Basic" },
            { value: "conversational", label: "Conversational" },
            { value: "fluent", label: "Fluent" },
            { value: "native", label: "Native/Bilingual" },
          ]}
          value={langLevel}
          style={{ marginVertical: 10, zIndex: 1 }}
          onChange={setLangLevel}
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
              if (langName.trim() === "") return;
              onAdd(langName, langLevel);
              onClose();
            }}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};
