import { isDeliverTxFailure, MsgVoteEncodeObject } from "@cosmjs/stargate";
import Long from "long";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { BrandText } from "../../../components/BrandText";
import { ConfirmationVote } from "../../../components/GovernanceBox/ConfirmationVote";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getKeplrOfflineSigner } from "../../../utils/keplr";
import { getTeritoriSigningStargateClient } from "../../../utils/teritori";

type VoteProposalModalProps = {
  isVisible?: boolean;
  onClose: () => void;
  onPressCancel: () => void;
  onPressConfirm: () => void;
  numberProposal: string;
};

export const VoteProposalModal: React.FC<VoteProposalModalProps> = ({
  isVisible,
  onClose,
  numberProposal,
  onPressCancel,
  onPressConfirm,
}) => {
  const [checked, setChecked] = useState("nothingChecked");

  const [displayConfirmationVote, setDisplayConfirmationVote] = useState(false);
  const { setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();

  const activeConfirmationVotePopup = () => {
    if (displayConfirmationVote && checked !== "nothingChecked") {
      return (
        <ConfirmationVote
          numberProposal={numberProposal}
          vote={checked}
          visible={displayConfirmationVote}
          onClose={deleteConfirmationVote}
        />
      );
    } else {
      return <></>;
    }
  };

  const deleteConfirmationVote = () => {
    setDisplayConfirmationVote(false);
    onClose();
  };

  const voteOption = () => {
    switch (checked) {
      case "Yes":
        return 1;
      case "No":
        return 3;
      case "NoWithVeto":
        return 4;
      case "Abstain":
        return 2;
    }
  };

  const handlePress = useCallback(async () => {
    if (!selectedWallet?.connected || !selectedWallet.address) {
      setToastError({
        title: "Wallet Error",
        message: "You need to register your teritori wallet",
      });
      return;
    }

    try {
      const keplrSigner = await getKeplrOfflineSigner();
      const client = await getTeritoriSigningStargateClient(keplrSigner);

      const vote: MsgVoteEncodeObject = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: {
          proposalId: Long.fromNumber(
            parseInt(numberProposal.substring(1), 10)
          ),
          voter: String(selectedWallet.address),
          option: voteOption(),
        },
      };
      const result = await client.signAndBroadcast(
        selectedWallet.address,
        [vote],
        "auto"
      );
      if (isDeliverTxFailure(result)) {
        setToastError({
          title: "Vote failed",
          message: "Transaction failed",
        });
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Vote failed",
          message: err.message,
        });
      }
    }
  }, [selectedWallet]);

  return (
    <>
      {activeConfirmationVotePopup()}
      <ModalBase
        onClose={onClose}
        label="Your vote"
        visible={isVisible}
        width={372}
        childrenBottom={
          <>
            <Separator />

            <View
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: 70,
                width: 480,
                right: 50,
              }}
            >
              <View>
                <SecondaryButton
                  size="M"
                  text="Cancel"
                  style={{}}
                  onPress={onPressCancel}
                />
              </View>
              <View>
                <PrimaryButton
                  disabled={checked === "nothingChecked"}
                  size="M"
                  text="Confirm"
                  onPress={() => {
                    handlePress();
                    setDisplayConfirmationVote(true);
                    onPressConfirm();
                  }}
                />
              </View>
            </View>
          </>
        }
      >
        <BrandText
          style={{
            fontSize: 14,
            color: "#777777",
          }}
        >
          {numberProposal}
        </BrandText>
        <BrandText
          style={{
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          IncreaseMaxValidators=100 to MaxValidators=110 {"\n"}
          {"\n"}
        </BrandText>

        <View style={{ paddingBottom: 10, flexDirection: "row" }}>
          <View>
            <RadioButton
              value="Yes"
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />

            <RadioButton
              value="No"
              color="#EAA54B"
              uncheckedColor="#777777"
              status={checked === "No" ? "checked" : "unchecked"}
              onPress={() => setChecked("No")}
            />
            <RadioButton
              value="NoWithVeto"
              color="#F46F76"
              uncheckedColor="#777777"
              status={checked === "NoWithVeto" ? "checked" : "unchecked"}
              onPress={() => setChecked("NoWithVeto")}
            />
            <RadioButton
              value="Abstain"
              color="#333333"
              uncheckedColor="#777777"
              status={checked === "Abstain" ? "checked" : "unchecked"}
              onPress={() => setChecked("Abstain")}
            />
          </View>
          <View
            style={{
              bottom: 8,
              height: 160,
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Yes
            </BrandText>
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              No
            </BrandText>
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              NoWithVeto
            </BrandText>
            <BrandText
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                marginRight: 209,
              }}
            >
              Abstain
            </BrandText>
          </View>

          <View
            style={{
              bottom: 8,
              height: 165,
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#16BBFF",
                borderRadius: 12,
              }}
            />
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#EAA54B",
                borderRadius: 12,
              }}
            />
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#F46F76",
                borderRadius: 12,
              }}
            />
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#333333",
                borderRadius: 12,
              }}
            />
          </View>
        </View>
      </ModalBase>
    </>
  );
};
