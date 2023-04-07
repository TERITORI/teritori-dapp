import { bech32 } from "bech32";
import { useEffect, useMemo, useState } from "react";

import { getUserId } from "../../networks";
import { useNSNameOwner } from "../useNSNameOwner";
import { useSelectedNetworkId } from "../useSelectedNetwork";

// Find if the mentioned text is a valid wallet address or a valid NS token id, and returns the corresponding userId
// ===> Detects if it's a valid mention
export const useMention = (mention: string) => {
  const mentionedText = useMemo(() => mention.replace("@", ""), [mention]);
  const selectedNetworkId = useSelectedNetworkId();
  const { nameOwner } = useNSNameOwner(selectedNetworkId, mentionedText);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // If the mention is a valid address or a valid NS token id, we can got a valid user id
    if (nameOwner) {
      setUserId(getUserId(selectedNetworkId, nameOwner));
    } else if (bech32.decodeUnsafe(mentionedText)) {
      setUserId(getUserId(selectedNetworkId, mentionedText));
    }
  }, [mentionedText, selectedNetworkId, nameOwner]);

  return { userId };
};
