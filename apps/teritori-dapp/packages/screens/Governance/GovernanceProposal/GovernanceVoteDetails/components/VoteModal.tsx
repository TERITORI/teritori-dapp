import React, { useState } from "react";
import { View } from "react-native";

import { VoteDetailsBorderText } from "./VoteDetailsBorderText";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import ModalBase from "@/components/modals/ModalBase";
import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral33,
  neutralA3,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

export const VoteModel: React.FC<{
  percentageYes: number;
  percentageNo: number;
  percentageNoWithVeto: number;
  percentageAbstain: number;
  visible: boolean;
  onClose: () => void;
}> = ({
  percentageYes,
  percentageNo,
  percentageNoWithVeto,
  percentageAbstain,
  visible,
  onClose,
}) => {
  const [selecteVote, setSelectedVote] = useState("");
  return (
    <ModalBase
      onClose={onClose}
      label="Vote"
      visible={visible}
      hideMainSeparator
      boxStyle={{ borderColor: neutral33 }}
      childrenBottom={
        <>
          <View
            style={{
              alignItems: "center",
              width: "100%",
              marginVertical: layout.spacing_x2,
            }}
          >
            <PrimaryButton
              size="M"
              text="Vote"
              width={152}
              loader
              onPress={onClose}
              disabled={selecteVote === ""}
            />
          </View>
        </>
      }
    >
      <View
        style={{
          flex: 1,
          gap: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x2,
          }}
        >
          <VoteDetailsBorderText
            title="Yes"
            percentage={percentageYes}
            color={additionalSuccess}
            isBorder={selecteVote === "Yes"}
            onPress={(item) => setSelectedVote(item)}
          />

          <VoteDetailsBorderText
            title="No"
            percentage={percentageNo}
            color={errorColor}
            isBorder={selecteVote === "No"}
            onPress={(item) => setSelectedVote(item)}
          />
        </View>

        <View style={{ flexDirection: "row", gap: layout.spacing_x2 }}>
          <VoteDetailsBorderText
            title="NoWithVeto"
            percentage={percentageNoWithVeto}
            color={additionalRed}
            isBorder={selecteVote === "NoWithVeto"}
            onPress={(item) => setSelectedVote(item)}
          />

          <VoteDetailsBorderText
            title="Abstain"
            percentage={percentageAbstain}
            color={neutralA3}
            isBorder={selecteVote === "Abstain"}
            onPress={(item) => setSelectedVote(item)}
          />
        </View>
      </View>
    </ModalBase>
  );
};
