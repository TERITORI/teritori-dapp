import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";

export const ProfileButton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { loading, metadata } = useTNSMetadata(selectedWallet?.address);
  const { setLoadingFullScreen } = useFeedbacks();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loading);
  }, [loading]);

  if (loading) return null;
  if (selectedWallet && metadata)
    return (
      <SecondaryButtonOutline
        size="XL"
        text="My profile"
        backgroundColor={neutral00}
        onPress={() =>
          navigation.navigate("UserPublicProfile", {
            id: `tori-${selectedWallet?.address}`,
          })
        }
        style={style}
      />
    );
  return (
    <SecondaryButtonOutline
      size="XL"
      text="Create profile"
      backgroundColor={neutral00}
      onPress={() => navigation.navigate("TNSHome", { modal: "register" })}
      style={style}
    />
  );
};
