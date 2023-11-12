import React, { memo } from "react";
import { View } from "react-native";

import { getNetwork } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { getTxInfo } from "../../utils/transactions/getTxInfo";
import { BrandText } from "../BrandText";
import { SpacerColumn } from "../spacer";

export const MessagesPreviewList: React.FC<{
  networkId: string | undefined;
  msgs: any[];
}> = memo(({ networkId, msgs }) => {
  const navigation = useAppNavigation();
  return (
    <>
      {msgs.map((message, index) => {
        let content;
        if (message.gno) {
          // TODO: move this in getTxInfo
          content = (
            <View>
              <BrandText>{message.type}</BrandText>
              <SpacerColumn size={2.5} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                {JSON.stringify(message.payload, null, 2)}
              </BrandText>
            </View>
          );
        } else {
          const { MessagePreview } = getTxInfo(
            [message],
            navigation,
            getNetwork(networkId),
          );
          content = <MessagePreview />;
        }
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
              {content}
            </View>
          </>
        );
      })}
    </>
  );
});
