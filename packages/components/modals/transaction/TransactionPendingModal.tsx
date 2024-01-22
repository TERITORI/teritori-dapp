import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import ModalBase from "../ModalBase";

// Modal with loader. Opens wallet to approve the transaction
export const TransactionPendingModal: React.FC<{
  operationLabel: string;
  onClose: () => void;
  visible?: boolean;
}> = ({ operationLabel = 0, onClose, visible = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={372}
      label="Follow steps"
    >
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <ActivityIndicator style={{ marginRight: 16 }} size="large" />
        <View>
          <BrandText style={fontSemibold20}>{operationLabel}</BrandText>
          <BrandText
            style={[fontSemibold14, { color: neutral77, marginTop: 4 }]}
          >
            Send transaction with your wallet
          </BrandText>
        </View>
      </View>
    </ModalBase>
  );
};
