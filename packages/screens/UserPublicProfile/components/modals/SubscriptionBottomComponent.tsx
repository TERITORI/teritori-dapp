import React from "react";
import { View } from "react-native";

import { layout } from "../../../../utils/style/layout";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";

export const SubscriptionBottomComponent: React.FC<{
  onSubmit: () => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        marginVertical: layout.spacing_x1,
        marginTop: layout.spacing_x2,
        flexDirection: "row",
      }}
    >
      <View style={{ marginHorizontal: layout.spacing_x1 }}>
        <SecondaryButton
          width={112}
          size="M"
          text="Cancel"
          loader
          onPress={() => {
            onClose();
          }}
        />
      </View>

      <View style={{ marginHorizontal: layout.spacing_x1 }}>
        <PrimaryButton
          width={112}
          size="M"
          text="Setup"
          loader
          onPress={() => {
            onSubmit();
          }}
        />
      </View>
    </View>
  );
};
