import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";

export const ProfileButton: React.FC<{
  touchableStyle?: StyleProp<ViewStyle>;
  isEdit?: boolean;
}> = ({ touchableStyle, isEdit }) => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { metadata } = useTNSMetadata(selectedWallet?.address);

  if (selectedWallet && metadata?.tokenId)
    return (
      <SecondaryButtonOutline
        size="XL"
        text={isEdit ? "Edit profile" : "My profile"}
        backgroundColor={neutral00}
        onPress={
          isEdit
            ? () =>
                navigation.navigate("TNSHome", {
                  modal: "update-name",
                  name: metadata.tokenId.replace(".tori", ""),
                })
            : () =>
                navigation.navigate("UserPublicProfile", {
                  id: `tori-${selectedWallet?.address}`,
                })
        }
        touchableStyle={touchableStyle}
      />
    );
  return (
    <SecondaryButtonOutline
      size="XL"
      text="Create profile"
      backgroundColor={neutral00}
      onPress={() => navigation.navigate("TNSHome", { modal: "register" })}
      touchableStyle={touchableStyle}
    />
  );
};
