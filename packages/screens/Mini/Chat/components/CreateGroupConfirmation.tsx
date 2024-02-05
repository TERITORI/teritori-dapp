import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { Separator } from "../../../../components/separators/Separator";
import { redDefault } from "../../../../utils/style/colors";
import {
  fontMedium14,
  fontMedium24,
  fontSemibold16,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/Button/CustomButton";
import MiniTextInput from "../../components/MiniTextInput";
import MobileModal from "../../components/MobileModal";

type Props = {
  selected: string[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  groupName: string;
  setGroupName: (text: string) => void;
};

export const CreateGroupConfirmation = ({
  isOpen,
  selected,
  onClose,
  onCreate,
  groupName,
  setGroupName,
}: Props) => {
  const [validationError, setValidationError] = useState("");

  const onCreateGroupPress = () => {
    if (!groupName) {
      setValidationError("Enter group name.");
      return;
    }

    onCreate();
    onClose();
  };

  return (
    <MobileModal
      visible={isOpen}
      onClose={onClose}
      innerContainerOptions={{ height: "40%" }}
    >
      <View
        style={{
          padding: layout.spacing_x2,
          flex: 1,
        }}
      >
        <BrandText
          style={[
            fontMedium24,
            { textAlign: "center", marginBottom: layout.spacing_x2 },
          ]}
        >
          Create Group
        </BrandText>
        <BrandText style={{ marginBottom: layout.spacing_x0_75 }}>
          Group Name
        </BrandText>
        <MiniTextInput
          onChangeText={(text) => {
            if (validationError) {
              setValidationError("");
            }
            setGroupName(text);
          }}
          placeholder="Group Name"
          style={{ marginBottom: layout.spacing_x3 }}
          value={groupName}
        />

        <BrandText style={{ marginBottom: layout.spacing_x0_75 }}>
          Selected Friends
        </BrandText>
        <Separator style={{ marginBottom: layout.spacing_x0_75 }} />
        {selected &&
          selected.map((sel, index) => (
            <BrandText key={index} style={[fontSemibold16]}>
              {sel}
            </BrandText>
          ))}
      </View>
      {validationError && (
        <BrandText
          style={[
            fontMedium14,
            {
              marginBottom: layout.spacing_x1,
              color: redDefault,
              paddingLeft: layout.spacing_x1_5,
            },
          ]}
        >
          {validationError}
        </BrandText>
      )}
      <CustomButton title="Create" onPress={onCreateGroupPress} />
    </MobileModal>
  );
};
