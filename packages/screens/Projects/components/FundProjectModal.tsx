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
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useBalances } from "@/hooks/useBalances";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature, getNetworkFeature } from "@/networks";
import { Tag } from "@/screens/Projects/components/Milestone";
import { useUtils } from "@/screens/Projects/hooks/useUtils";
import { Project } from "@/screens/Projects/types";
import { prettyPrice } from "@/utils/coins";
import { adenaVMCall } from "@/utils/gno";
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

  const balances = useBalances(selectedNetwork?.id, selectedWallet?.address);
  const bal = balances?.find((b) => b.denom === pmFeature?.paymentsDenom);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { mustGetValue } = useUtils();

  const submitFunder = async () => {
    setIsSubmitting(true);

    try {
      const caller = mustGetValue(selectedWallet?.address, "caller");
      if (!pmFeature) {
        throw new Error("Project manager feature not found");
      }

      await adenaVMCall(
        networkId,
        {
          caller,
          send: project.budget + pmFeature.paymentsDenom,
          pkg_path: pmFeature.projectsManagerPkgPath,
          func: "SubmitFunder",
          args: [
            project.id.toString(),
            project.milestones.map((m) => m.id).join(","),
          ],
        },
        { gasWanted: 1_000_000 },
      );

      setToastSuccess({
        title: "Success",
        message: "You become the funder for this project !",
      });
      onClose();
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fundingAmount = useMemo(() => {
    return project.milestones
      .map((m) => m.amount)
      .reduce((total, amount) => total + amount, 0)
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
