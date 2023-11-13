import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
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
import { TERITORI_FEED_ID } from "../const";

type FlagModalProps = {
  postId: string;
  onClose: (nextModalName?: string) => void;
  isVisible: boolean;
  refetchFeed?: () => Promise<any>;
};

type FlagType = "hideForMe" | "hideForAll";

export const FlagModal: React.FC<FlagModalProps> = ({
  postId,
  onClose,
  isVisible,
  refetchFeed,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [flagType, setFlagType] = useState<FlagType>("hideForMe");
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id;
  const selectedWallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const doAction = async () => {
    setIsLoading(true);
    const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);

    const vmCall = {
      caller: selectedWallet?.address,
      send: "",
      pkg_path: gnoNetwork.socialFeedsPkgPath,
      func: flagType === "hideForMe" ? "HidePostForMe" : "FlagPost",
      args: [TERITORI_FEED_ID, postId],
    };

    try {
      await adenaDoContract(
        selectedNetworkId || "",
        [{ type: "/vm.m_call", value: vmCall }],
        {
          gasWanted: 2_000_000,
        },
      );

      await refetchFeed?.();

      setToastSuccess({ title: "Report success", message: "" });
    } catch (err: any) {
      console.error(err);
      setToastError({ title: "Report failed", message: err.message });
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={480}
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

        <Pressable onPress={() => setFlagType("hideForMe")}>
          <FlexRow>
            <RadioButton selected={flagType === "hideForMe"} />
            <SpacerRow size={1} />
            <BrandText style={fontSemibold16}>
              Hide this content from my feed
            </BrandText>
          </FlexRow>
        </Pressable>

        <SpacerColumn size={2} />

        <Pressable onPress={() => setFlagType("hideForAll")}>
          <FlexRow>
            <RadioButton selected={flagType === "hideForAll"} />
            <SpacerRow size={1} />
            <BrandText style={fontSemibold16}>
              Flag this content for all users
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
            onPress={doAction}
            disabled={false}
          />
        </View>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};
