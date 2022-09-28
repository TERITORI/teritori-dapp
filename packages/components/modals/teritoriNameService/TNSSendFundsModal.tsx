import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { numberWithThousandsSeparator } from "../../../utils/numbers";
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
      <View>
        <TextInputCustom<SendFundFormType>
          name="comment"
          label="COMMENT ?"
          value={comment}
          placeHolder="Type your comment here"
          onChangeText={setComment}
          style={{ marginBottom: 12 }}
          width={322}
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TextInputCustom<SendFundFormType>
            name="amount"
            label="TORI AMOUNT ?"
            value={numberWithThousandsSeparator(amount)}
            placeHolder="Type your amount here"
            onChangeText={setAmount}
            onlyNumbers
            style={{ marginRight: 12, minWidth: 0 }}
            width={322}
          />
          <PrimaryButton size="M" text="Send" />
        </View>
      </View>
    </ModalBase>
  );
};
