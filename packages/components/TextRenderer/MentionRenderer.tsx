import { bech32 } from "bech32";
import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

import { useNSNameInfo } from "../../hooks/useNSNameInfo";
import { useNSNameOwner } from "../../hooks/useNSNameOwner";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutralA3, primaryColor } from "../../utils/style/colors";

export const MentionRender: React.FC<{ text: string }> = ({ text }) => {
  const navigation = useAppNavigation();
  const mention = useMemo(() => text.replace("@", ""), [text]);
  const selectedNetworkId = useSelectedNetworkId();
  const { nsInfo } = useNSNameInfo(selectedNetworkId, mention);
  const [userId, setUserId] = useState("");
  const { nameOwner } = useNSNameOwner(selectedNetworkId, mention);

  useEffect(() => {
    if (bech32.decodeUnsafe(mention))
      setUserId(getUserId(selectedNetworkId, mention));
    if (nsInfo) setUserId(getUserId(selectedNetworkId, nameOwner));
  }, [mention, nameOwner]);

  // Every text with a "@" is a mention. But we give mention's style only if text is a valid TNS token_id or a bech32 address
  if (!userId) {
    return <Text style={{ color: neutralA3 }}>{text}</Text>;
  }
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PublicProfile", {
          id: userId,
        })
      }
    >
      <Text style={{ color: primaryColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
