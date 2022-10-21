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
  const { loading, metadata } = useTNSMetadata(selectedWallet?.publicKey || "");
  const { setLoadingFullScreen } = useFeedbacks();
  const name = metadata?.public_name.replace(process.env.TLD, "") || "";

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loading);
  }, [loading]);

  if (loading) return null;
  else if (metadata)
    return (
      <SecondaryButtonOutline
        size="XL"
        text="Edit profile"
        backgroundColor={neutral00}
        onPress={() => navigation.navigate("TNSUpdateName", { name })}
        style={style}
      />
    );
  else
    return (
      <SecondaryButtonOutline
        size="XL"
        text="Create profile"
        backgroundColor={neutral00}
        onPress={() => navigation.navigate("TNSRegister")}
        style={style}
      />
    );
};
