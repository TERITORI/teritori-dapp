import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";

export const ProfileButton: React.FC<{
  touchableStyle?: StyleProp<ViewStyle>;
  isEdit?: boolean;
}> = ({ touchableStyle, isEdit }) => {
  const navigation = useAppNavigation();
  const { selectedWallet } = useSelectedWallet();
  const network = getCosmosNetwork(selectedWallet?.networkId);
  const { metadata } = useNSUserInfo(selectedWallet?.userId);

  if (selectedWallet && metadata?.tokenId)
    return (
      <SecondaryButtonOutline
        size="XL"
        text={isEdit ? "Edit profile" : "My profile"}
        backgroundColor={neutral00}
        onPress={() => {
          if (!isEdit) {
            navigation.navigate("UserPublicProfile", {
              id: selectedWallet.userId,
            });
            return;
          }
          if (metadata.tokenId) {
            navigation.navigate("TNSHome", {
              modal: "update-name",
              name: metadata.tokenId.replace(".tori", ""),
            });
          }
        }}
        touchableStyle={touchableStyle}
      />
    );

  if (network?.nameServiceContractAddress) {
    return (
      <SecondaryButtonOutline
        size="XL"
        text="Create profile"
        backgroundColor={neutral00}
        onPress={() => navigation.navigate("TNSHome", { modal: "register" })}
        touchableStyle={touchableStyle}
      />
    );
  }

  return null;
};
