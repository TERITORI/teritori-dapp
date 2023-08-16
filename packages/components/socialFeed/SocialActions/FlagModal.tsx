import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetGnoNetwork } from "../../../networks";
import { adenaDoContract } from "../../../utils/gno";
import { neutral77, neutral33 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { RadioButton } from "../../RadioButton";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../spacer";

type FlagModalProps = {
  postId: string;
  onClose: () => void;
  isVisible: boolean;
};

export const FlagModal: React.FC<FlagModalProps> = ({
  postId,
  onClose,
  isVisible,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [radioIdx, setRadioIdx] = useState(0);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const sendReport = async () => {
    setIsLoading(true);
    const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);

    const vmCall = {
      caller: selectedWallet?.address,
      send: "",
      pkg_path: gnoNetwork.socialFeedsPkgPath,
      func: "FlagPost",
      args: [],
    };

    try {
      await adenaDoContract(
        selectedNetworkId || "",
        [{ type: "/vm.m_call", value: vmCall }],
        {
          gasWanted: 1_000_000,
        }
      );

      onClose();
      setToastSuccess({ title: "Report success", message: "" });
    } catch (err: any) {
      console.error(err);
      setToastError({ title: "Report failed", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={400}
      label="Flag this content"
    >
      <View
        style={{
          alignItems: "flex-start",
        }}
      >
        <BrandText style={fontSemibold16}>
          Let us know why you would like to report this content
        </BrandText>
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Your report will be kept anonymous
        </BrandText>
        <SpacerColumn size={2.5} />

        <Pressable onPress={() => setRadioIdx(0)}>
          <FlexRow>
            <RadioButton selected={radioIdx === 0} />
            <SpacerRow size={1} />
            <BrandText style={fontSemibold16}>
              Hide this content from my feed
            </BrandText>
          </FlexRow>
        </Pressable>

        <SpacerColumn size={2} />

        <Pressable onPress={() => setRadioIdx(1)}>
          <FlexRow>
            <RadioButton selected={radioIdx === 1} />
            <SpacerRow size={1} />
            <BrandText style={fontSemibold16}>
              Vote to hide this content for all users
            </BrandText>
          </FlexRow>
        </Pressable>

        <SpacerColumn size={2.5} />
        <View
          style={{
            alignItems: "flex-end",
            width: "100%",
            borderTopColor: neutral33,
            borderTopWidth: 1,
          }}
        >
          <SpacerColumn size={2.5} />
          <PrimaryButton
            size="SM"
            text="Send report"
            loader
            isLoading={isLoading}
            onPress={sendReport}
            disabled={false}
          />
        </View>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};
