import React, { FC } from "react";
import { View, ViewStyle } from "react-native";

import { MultisigTransactionItemProps } from "./MultisigTransactionItem";
import { getCosmosNetworkByChainId, getUserId } from "../../networks";
import { fontSemibold14 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";
import { MessagesPreviewList } from "../transactions/MessagesPreviewList";
import { Username } from "../user/Username";

export const MultisigTransactionModal: FC<{
  visible?: boolean;
  onClose: () => void;
  transaction: MultisigTransactionItemProps;
}> = ({ visible, onClose, transaction }) => {
  const network = getCosmosNetworkByChainId(transaction.chainId);
  const creatorId = getUserId(network?.id, transaction.creatorAddress);
  return (
    <ModalBase
      onClose={onClose}
      label={`Transaction #${transaction.sequence}`}
      visible={visible}
      width={800}
      scrollable
      closeOnBlur
    >
      <View
        style={{
          marginTop: 10,
          flexDirection: "column",
          marginBottom: modalMarginPadding,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            marginBottom: 10,
          }}
        >
          <View style={rowStyles}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <Username userId={creatorId} textStyle={fontSemibold14} />
          </View>

          <SpacerColumn size={2.5} />

          <MessagesPreviewList
            networkId={network?.id}
            msgs={transaction.msgs}
          />
        </View>
      </View>
    </ModalBase>
  );
};

const rowStyles: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
