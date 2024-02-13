import React, { useState } from "react";
import { View } from "react-native";

import gnoSVG from "@/assets/icons/networks/gno.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { mustGetGnoNetwork } from "@/networks";
import { Tag } from "@/screens/Projects/components/Milestone";
import { useUtils } from "@/screens/Projects/hooks/useUtils";
import { Project } from "@/screens/Projects/types";
import { adenaVMCall } from "@/utils/gno";
import { neutral17, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

type SubmitContractorCandidateModalProps = {
  isVisible: boolean;
  onClose: () => void;
  project: Project;
};

export const SubmitContractorCandidateModal: React.FC<
  SubmitContractorCandidateModalProps
> = ({ isVisible, onClose, project }) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkInfo();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { mustGetValue } = useUtils();

  const submitContractorCandidate = async () => {
    setIsSubmitting(true);

    try {
      const gnoNetwork = mustGetGnoNetwork(networkId);
      const caller = mustGetValue(selectedWallet?.address, "caller");
      const escrowPkgPath = mustGetValue(
        gnoNetwork.escrowPkgPath,
        "escrow pkg path",
      );

      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "SubmitContractorCandidate",
          args: [project.id.toString()],
        },
        { gasWanted: 1_000_000 },
      );

      setToastSuccess({
        title: "Success",
        message: "You candidate has been submitted",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      label="Sign the transaction"
      visible={isVisible}
      width={480}
    >
      <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
        You’re making the signature to validate a transaction
      </BrandText>

      <SpacerColumn size={2} />

      <TertiaryBox
        style={{
          padding: layout.spacing_x1_5,
          flexDirection: "row",
          backgroundColor: neutral17,
          alignItems: "center",
        }}
      >
        <SVG width={20} height={20} source={gnoSVG} />

        <SpacerRow size={1.5} />

        <View style={{ flexGrow: 1 }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold12]}>
            {selectedNetwork?.displayName}
          </BrandText>

          <BrandText style={fontSemibold13}>
            {tinyAddress(selectedWallet?.address, 16)}
          </BrandText>
        </View>

        {selectedWallet?.address && <Tag text="connected" color="#C8FFAE" />}
      </TertiaryBox>

      <SpacerColumn size={1.5} />

      <PrimaryButton
        fullWidth
        disabled={isSubmitting}
        text="Confirm and Sign"
        onPress={() => submitContractorCandidate()}
      />

      <SpacerColumn size={2} />

      <SecondaryButton
        fullWidth
        size="M"
        disabled={isSubmitting}
        text="Cancel"
        onPress={onClose}
      />

      <SpacerColumn size={2} />
    </ModalBase>
  );
};
