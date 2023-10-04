import React, { memo } from "react";
import { View } from "react-native";

import { getNetwork } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral77 } from "../../utils/style/colors";
import { getTxInfo } from "../../utils/transactions/getTxInfo";
import { SpacerColumn } from "../spacer";

export const MessagesPreviewList: React.FC<{
  networkId: string | undefined;
  msgs: any[];
}> = memo(({ networkId, msgs }) => {
  const navigation = useAppNavigation();
  return (
    <>
      {msgs.map((message, index) => {
        const { MessagePreview } = getTxInfo(
          [message],
          navigation,
          getNetwork(networkId)
        );
        return (
          <>
            {index !== 0 && <SpacerColumn size={2.5} />}
            <View
              style={{
                borderWidth: 1,
                borderColor: neutral77,
                borderRadius: 8,
                padding: 8,
              }}
            >
              <MessagePreview />
            </View>
          </>
        );
      })}
    </>
  );
});
