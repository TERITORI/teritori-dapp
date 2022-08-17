import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { numberWithThousandsSeparator } from "../../utils/numbers";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";

export const SendFundModal: React.FC<{
  onClose: () => void;
  visible?: boolean;
}> = ({ onClose, visible }) => {
  const [comment, setComment] = useState("Sent from Teritori");
  const [amount, setAmount] = useState("1000");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={372}
      label={`Your wallet has ${numberWithThousandsSeparator(1000)} Tori`}
      // childrenBottom={
      //   <View style={{ marginHorizontal: 20 }}>
      //     <View style={{ borderBottomWidth: 1, borderColor: neutral44 }} />
      //     <View
      //       style={{
      //         flex: 1,
      //         flexDirection: "row",
      //         width: "100%",
      //         alignItems: "center",
      //         justifyContent: "space-between",
      //         marginVertical: 20,
      //       }}
      //     >
      //       <BacKTo
      //         label="search"
      //         justBack
      //         onPress={() => setIsVisible(false)}
      //       />
      //       {/*<DarkButton text={"Show paths"} style={{width: "fit-content"}}/>*/}
      //     </View>
      //   </View>
      // }
    >
      <View>
        <TextInputCustom
          label="COMMENT ?"
          value={comment}
          placeHolder="Type your comment here"
          onChangeText={setComment}
          style={{ marginBottom: 12 }}
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TextInputCustom
            label="TORI AMOUNT ?"
            value={numberWithThousandsSeparator(amount)}
            placeHolder="Type your amount here"
            onChangeText={setAmount}
            onlyNumbers
            style={{ marginRight: 12, minWidth: 0 }}
          />
          <PrimaryButton text="Send" style={{ width: "fit-content" }} />
        </View>
      </View>
    </ModalBase>
  );
};
