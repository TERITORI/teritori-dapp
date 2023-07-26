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
import { CertificationInfo } from "../types/fields";

export const AddNewCertificationCard: React.FC<{
  value?: CertificationInfo;
  onClose: () => void;
  onAdd: (certificateInfo: CertificationInfo) => void;
}> = ({ value, onClose, onAdd }) => {
  const [name, setName] = useState(value ? value.name : "");
  const [from, setFrom] = useState(value ? value.from : "");
  return (
    <TertiaryBox fullWidth style={{ marginTop: 10, zIndex: 1 }}>
      <View style={{ width: "100%", padding: 10 }}>
        <TextInputCustom
          label=""
          name="name"
          placeHolder="Certificate Or Award"
          value={name}
          style={{ marginTop: 5 }}
          onChangeText={setName}
        />
        <TextInputCustom
          label=""
          name="from"
          placeHolder="Certified From (E.G. Adobe)"
          value={from}
          style={{ marginTop: 10 }}
          onChangeText={setFrom}
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
              if (name.trim() === "") return;
              if (from.trim() === "") return;
              onAdd({ name, from } as CertificationInfo);
              onClose();
            }}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};
