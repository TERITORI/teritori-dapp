import React, { useState, useEffect } from "react";

import { OrderParams } from "../../../contracts-clients/teritori-freelance/TeritoriOrder.types";
import { OrderFormType } from "../../../utils/types/order";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../ModalBase";

export const FreelanceOrderModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  onEnter: (values: OrderParams) => Promise<void>;
}> = ({ visible, onClose, onEnter }) => {
  const [cw20Addr, setCw20Addr] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [seller, setSeller] = useState<string>();
  const [expireAt, setExpireAt] = useState<string>();
  const onPressEnter = () => {
    onEnter({
      cw20Addr,
      amount,
      seller,
      expireAt,
    });
  };

  useEffect(() => {
    // Reset the name each time the modal appears
    if (visible) {
      setCw20Addr("");
      setAmount("0");
      setSeller("");
      setExpireAt("10000");
    }
  }, [visible]);

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      label="Input Order Information"
      width={372}
    >
      <TextInputCustom<OrderFormType>
        name="cw20_addr"
        label="Cw20_Token"
        placeHolder="Empty string for native token"
        onChangeText={setCw20Addr}
        value={cw20Addr}
        regexp={new RegExp(/^[a-zA-Z\d]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
      />
      <TextInputCustom<OrderFormType>
        name="amount"
        label="Amount"
        placeHolder="Type amount here"
        onChangeText={setAmount}
        value={amount}
        regexp={new RegExp(/^[\d]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
      />
      <TextInputCustom<OrderFormType>
        name="seller"
        label="Seller Addr"
        placeHolder="Type seller address here"
        onChangeText={setSeller}
        value={seller}
        regexp={new RegExp(/^[a-zA-z\d]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
      />
      <TextInputCustom<OrderFormType>
        name="expire_at"
        label="ExpireAt(seconds)"
        placeHolder="Type expire seconds here"
        onChangeText={setExpireAt}
        value={expireAt}
        regexp={new RegExp(/^[\d]+$/)}
        style={{ marginBottom: 20, width: "100%" }}
      />
      <PrimaryButton
        size="M"
        text="Order"
        touchableStyle={{ marginBottom: 20 }}
        fullWidth
        disabled={!amount || !seller || !expireAt}
        onPress={onPressEnter}
      />
    </ModalBase>
  );
};
