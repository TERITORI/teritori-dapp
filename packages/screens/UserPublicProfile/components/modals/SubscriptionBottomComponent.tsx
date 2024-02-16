import React from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { layout } from "@/utils/style/layout";

export const SubscriptionBottomComponent: React.FC<{
  submitDisabled?: boolean;
  submitLabel: string;
  onSubmit: (() => Promise<void>) | (() => void);
  onClose: (() => Promise<void>) | (() => void);
}> = ({ onSubmit, onClose, submitDisabled, submitLabel }) => {
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
          onPress={onClose}
        />
      </View>

      <View style={{ marginHorizontal: layout.spacing_x1 }}>
        <PrimaryButton
          disabled={submitDisabled}
          width={112}
          size="M"
          text={submitLabel}
          loader
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};
