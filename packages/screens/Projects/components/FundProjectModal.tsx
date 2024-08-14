import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

import gnoSVG from "@/assets/icons/networks/gno.svg";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useBalances } from "@/hooks/useBalances";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  NetworkFeature,
  getNetworkFeature,
  getNetworkObjectId,
} from "@/networks";
import { Tag } from "@/screens/Projects/components/Milestone";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { prettyPrice } from "@/utils/coins";
import { Project } from "@/utils/projects/types";
import { neutral17, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

type FundProjectModalProps = {
  isVisible: boolean;
  onClose: () => void;
  project: Project;
};

export const FundProjectModal: React.FC<FundProjectModalProps> = ({
  isVisible,
  onClose,
  project,
}) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkInfo();

  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  const { balances } = useBalances(
    selectedNetwork?.id,
    selectedWallet?.address,
  );
  const bal = balances?.find((b) => b.denom === pmFeature?.paymentsDenom);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );

  const queryClient = useQueryClient();

  const submitFunder = async () => {
    setIsSubmitting(true);
    try {
      await execEscrowMethod(
        "SubmitFunder",
        [project.id?.toString()],
        `${project.budget}${project.paymentDenom}`,
      );
      await Promise.all([
        queryClient.invalidateQueries([
          "project",
          getNetworkObjectId(networkId, project.id),
        ]),
        queryClient.invalidateQueries(["projects", networkId]),
      ]);
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  };

  const fundingAmount = useMemo(() => {
    return project.milestones
      .map((m) => m.amount)
      .reduce((total, amount) => total + BigInt(amount), BigInt(0))
      .toString();
  }, [project]);

  return (
    <ModalBase
      onClose={onClose}
      label="Fund this project"
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

      <FlexRow style={{ justifyContent: "space-between" }}>
        <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
          Funding amount
        </BrandText>

        <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
          {prettyPrice(networkId, fundingAmount, pmFeature?.paymentsDenom)}
        </BrandText>
      </FlexRow>

      <FlexRow style={{ justifyContent: "space-between" }}>
        <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
          Balance
        </BrandText>

        <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
          {prettyPrice(networkId, bal?.amount, pmFeature?.paymentsDenom)}
        </BrandText>
      </FlexRow>

      <SpacerColumn size={2} />

      <PrimaryButton
        fullWidth
        disabled={isSubmitting}
        text="Confirm transaction"
        testID="confirm-and-sign"
        onPress={() => submitFunder()}
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
