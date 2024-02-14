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
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { Tag } from "@/screens/Projects/components/Milestone";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { Project } from "@/screens/Projects/types";
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

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address || "",
  );

  const submitContractorCandidate = async () => {
    setIsSubmitting(true);

    await execEscrowMethod("SubmitContractorCandidate", [
      project.id.toString(),
    ]);

    onClose();
    setIsSubmitting(false);
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
