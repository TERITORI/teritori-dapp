import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork, NetworkFeature } from "../../networks";
import { neutral00 } from "../../utils/style/colors";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { EditProfileModal } from "../user/modals/EditProfileModal";

import { ButtonsSize } from "@/utils/style/buttons";

export const ProfileButton: React.FC<{
  buttonSize?: ButtonsSize;
  style?: StyleProp<ViewStyle>;
  isEdit?: boolean;
  setIsEditProfileModal?: (val: boolean) => void;
}> = ({ style, buttonSize = "XL" }) => {
  const selectedWallet = useSelectedWallet();

  const network = getNetwork(selectedWallet?.networkId);

  if (!network?.features.includes(NetworkFeature.NameService)) {
    return null;
  }

  return (
    <RegisterButton networkId={network?.id} style={style} size={buttonSize} />
  );
};

const RegisterButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  networkId: string | undefined;
  size: ButtonsSize;
}> = ({ networkId, style, size }) => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  return (
    <View style={style}>
      <SecondaryButtonOutline
        size={size}
        text="Edit profile"
        backgroundColor={neutral00}
        onPress={() => setProfileModalVisible(true)}
      />

      {profileModalVisible && (
        <EditProfileModal onClose={() => setProfileModalVisible(false)} />
      )}
    </View>
  );
};
