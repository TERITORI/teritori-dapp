import React from "react";
import { View } from "react-native";

import MobileModal from "../../components/MobileModal";

import { BrandText } from "@/components/BrandText";
import { CustomButton } from "@/components/buttons/CustomButton";
import { fontMedium14, fontSemibold18 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  open: boolean;
  onClose: () => void;
  onYes: () => void;
};

const LeaveGroupModal = ({ onClose, onYes, open }: Props) => {
  return (
    <MobileModal
      visible={open}
      onClose={onClose}
      innerContainerOptions={{ height: 220 }}
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2_5,
          paddingVertical: layout.spacing_x4,
        }}
      >
        <BrandText
          style={[fontSemibold18, { marginBottom: layout.spacing_x1_5 }]}
        >
          Are you sure you want to leave group?
        </BrandText>
        <BrandText style={[fontMedium14]}>
          Once you leave group, you cannot view or send message.
        </BrandText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x2,
            marginVertical: layout.spacing_x5,
          }}
        >
          <CustomButton
            title="Yes"
            onPress={onYes}
            style={{ flex: 1 }}
            type="danger"
          />
          <CustomButton
            title="No"
            onPress={onClose}
            style={{ flex: 1 }}
            type="gray"
          />
        </View>
      </View>
    </MobileModal>
  );
};

export default LeaveGroupModal;
