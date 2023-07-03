import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork } from "../../networks";
import { neutral00 } from "../../utils/style/colors";
import { OmniLink } from "../OmniLink";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";

export const ProfileButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  isEdit?: boolean;
}> = ({ style, isEdit }) => {
  const { selectedWallet } = useSelectedWallet();
  const network = getCosmosNetwork(selectedWallet?.networkId);
  const { metadata } = useNSUserInfo(selectedWallet?.userId);

  if (selectedWallet && metadata?.tokenId)
    return (
      <OmniLink
        style={style}
        to={
          !isEdit
            ? {
                screen: "UserPublicProfile",
                params: {
                  id: selectedWallet.userId,
                },
              }
            : metadata.tokenId
            ? {
                screen: "TNSHome",
                params: {
                  modal: "update-name",
                  name: metadata.tokenId.replace(".tori", ""),
                },
              }
            : { screen: "ComingSoon" }
        }
      >
        <SecondaryButtonOutline
          size="XL"
          text={isEdit ? "Edit profile" : "My profile"}
          backgroundColor={neutral00}
        />
      </OmniLink>
    );

  if (network?.nameServiceContractAddress) {
    return (
      <OmniLink
        to={{
          screen: "TNSHome",
          params: {
            modal: "register",
          },
        }}
        style={style}
      >
        <SecondaryButtonOutline
          size="XL"
          text="Create profile"
          backgroundColor={neutral00}
        />
      </OmniLink>
    );
  }

  return null;
};
