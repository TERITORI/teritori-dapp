import React, { useEffect, useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";

import { neutral44 } from "../../utils/style/colors";
import { BrandText } from "../BrandText/BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const CreateProposalPopUp: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayCreateBountyMission, setdisplayCreateBountyMission] =
    useState(visible);
  const [lastPorposalId, setlastPorposalId] = useState("");

  useEffect(() => {
    fetch("https://rest.testnet.teritori.com/cosmos/gov/v1beta1/proposals")
      .then((res) => res.json())
      .then((kl) =>
        setlastPorposalId(kl.proposals[kl.proposals.length - 1].proposal_id)
      );
  }, []);

  function handleConfirmClick() {
    onClose();
    setdisplayCreateBountyMission(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
      }}
      label="Create Proposal"
      visible={displayCreateBountyMission}
      width={632}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 10,
          marginTop: -10,
        }}
      >
        <View style={{ padding: 7, width: 450 }}>
          <TextInputCustom<{ "PROPOSAL NAME": string }>
            name="PROPOSAL NAME"
            label="PROPOSAL NAME"
            placeHolder="Name"
          />
        </View>
        <View style={{ padding: 7 }}>
          <TertiaryBox width={100} height={55}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "flex-start",
              }}
            >
              <BrandText style={{ fontSize: 10, color: "#555555" }}>
                PROPOSAL ID
              </BrandText>
              <BrandText style={{ fontSize: 14, color: "#555555" }}>
                #{parseInt(lastPorposalId, 2) + 1}
              </BrandText>
            </View>
          </TertiaryBox>
        </View>
      </View>

      <Separator />

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 25,
          marginTop: 10,
        }}
      >
        <View style={{ padding: 7, height: 300 }}>
          <TextInputCustom<{ Timezone: string }>
            name="Timezone"
            label=""
            placeHolder="Type description here"
            height={300}
            center={false}
            multiLine
            numberLines={9}
          />
        </View>
      </View>

      <Separator />

      <View
        style={{ flexDirection: "column", alignContent: "center", margin: 10 }}
      >
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <PrimaryButton width={575} size="XL" text="Create mission" />
        </View>
      </View>
    </ModalBase>
  );
};
