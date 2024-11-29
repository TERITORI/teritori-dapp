import React, { useState } from "react";
import { View } from "react-native";

import friendGraySVG from "../../../../../assets/icons/friend-gray.svg";
import MiniTextInput from "../../components/MiniTextInput";
import MobileModal from "../../components/MobileModal";
import TitleBar from "../../components/TitleBar";

import { BrandText } from "@/components/BrandText";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn } from "@/components/spacer";
import {
  neutral33,
  neutralA3,
  redDefault,
  withAlpha,
} from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  selected: string[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  groupName: string;
  setGroupName: (text: string) => void;
};

export const CreateGroupModal = ({
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
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <>
          <TitleBar
            title="Create a Group"
            subTitle="Please enter the group name below"
            icon={friendGraySVG}
          />

          <View style={{ width: "100%" }}>
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
            <SpacerColumn size={3} />
            <MiniTextInput
              placeholder="Group Name"
              style={{ backgroundColor: withAlpha(neutral33, 0.9) }}
              placeholderTextColor={neutralA3}
              value={groupName}
              onSubmitEditing={onCreateGroupPress}
              onChangeText={(text) => {
                if (validationError) {
                  setValidationError("");
                }
                setGroupName(text);
              }}
            />
            <SpacerColumn size={1.5} />
            <CustomButton title="Create" onPress={onCreateGroupPress} />
            <SpacerColumn size={2} />
          </View>
        </>
      </View>
    </MobileModal>
  );
};
