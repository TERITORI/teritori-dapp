import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { numberWithThousandsSeparator } from "../../../utils/numbers";
import { toriCurrency } from "../../../utils/teritori";
import { SendFundFormType } from "../../../utils/types/tns";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../ModalBase";

export const SendFundModal: React.FC<{
  onClose: () => void;
  visible?: boolean;
}> = ({ onClose, visible }) => {
  const [comment, setComment] = useState("Sent from Teritori");
  const [amount, setAmount] = useState("1000");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible || false);
  }, [visible]);

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={372}
      label={`Your wallet has ${numberWithThousandsSeparator(1000)} Tori`}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <TextInputCustom<SendFundFormType>
          name="comment"
          label="COMMENT ?"
          value={comment}
          placeHolder="Type your comment here"
          onChangeText={setComment}
          style={{ marginBottom: 12 }}
          width={322}
        />

        <TextInputCustom<SendFundFormType>
          name="amount"
          label="TORI AMOUNT ?"
          value={amount}
          placeHolder="Type your amount here"
          onChangeText={setAmount}
          currency={toriCurrency}
          style={{ marginRight: 12, minWidth: 0 }}
          width={322}
        />
        <PrimaryButton
          size="M"
          text="Send"
          style={{
            marginVertical: 20,
          }}
        />
      </View>
    </ModalBase>
  );
};
