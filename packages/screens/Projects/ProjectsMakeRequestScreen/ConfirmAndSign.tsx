import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Image, View } from "react-native";

import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import projectSuccessPaymentPNG from "../../../../assets/project-success-payment.png";
import ModalBase from "../../../components/modals/ModalBase";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { Tag } from "../components/Milestone";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import {
  MilestoneRequest,
  ProjectShortDescData,
  ProjectTeamAndLinkData,
} from "../types";

import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SecondaryButtonOutline } from "@/components/buttons/SecondaryButtonOutline";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useBalances } from "@/hooks/useBalances";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import { NetworkFeature, getNetworkFeature } from "@/networks";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { prettyPrice } from "@/utils/coins";
import { useAppNavigation } from "@/utils/navigation";
import {
  neutral00,
  neutral17,
  neutral33,
  neutral77,
  neutralFF,
} from "@/utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

export const ConfirmAndSign: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigation = useAppNavigation();
  const {
    projectFormData,
    milestones,
    teamAndLinkData: teamAndLinkFormData,
  } = useMakeRequestState();
  const networkId = useSelectedNetworkId();

  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkInfo();
  const { balances } = useBalances(
    selectedNetwork?.id,
    selectedWallet?.address,
  );
  const bal = balances?.find((b) => b.denom === pmFeature?.paymentsDenom);

  const { setToast } = useFeedbacks();

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );

  const queryClient = useQueryClient();

  const cancel = async () => {
    setIsShowConfirmModal(false);
    navigation.replace("Projects", { network: networkId });
  };

  const confirmAndSign = async () => {
    try {
      setIsProcessing(true);

      if (!projectFormData.coverImg) {
        setIsShowConfirmModal(false);
        throw Error("Cover image file is required");
      }

      if (!pmFeature) {
        throw Error("Project manager feature not found");
      }

      const coverImg = projectFormData.coverImg;

      // other party can't accept contract after duration expired
      const expiryDuration = 24 * 60 * 60; // 1 day in seconds

      const shortDescData: ProjectShortDescData = {
        name: projectFormData.name,
        desc: projectFormData.description,
        coverImg,
        tags: projectFormData.tags || "",
      };

      const teamAndLinkData: ProjectTeamAndLinkData = {
        websiteLink: teamAndLinkFormData.websiteLink,
        twitterProfile: teamAndLinkFormData.twitterProfile,
        discordLink: teamAndLinkFormData.discordLink,
        githubLink: teamAndLinkFormData.githubLink,
        teamDesc: teamAndLinkFormData.teamDesc,
      };

      const metadata = JSON.stringify({
        shortDescData,
        teamAndLinkData,
      });

      const conflictHandler = projectFormData.arbitratorAddress;

      let send = "";
      // If creator = funder then we need to send all needed fund
      if (projectFormData.creatorKind === "funder") {
        send = totalFunding + pmFeature.paymentsDenom;
      }

      const contractor =
        projectFormData.creatorKind === "contractor"
          ? projectFormData.creatorAddress
          : "";
      const funder =
        projectFormData.creatorKind === "funder"
          ? projectFormData.creatorAddress
          : "";

      const args = [
        contractor,
        funder,
        pmFeature.paymentsDenom,
        metadata,
        expiryDuration.toString(),
        JSON.stringify(
          milestones.map((ms) => {
            const req: MilestoneRequest = {
              title: ms.title,
              desc: ms.desc,
              duration: ms.duration.toString(),
              amount: ms.amount.toString(),
              link: ms.link || "",
              priority: ms.priority,
            };
            return req;
          }),
        ),
        conflictHandler,
      ];
      console.log("executing contract creation", args);

      await execEscrowMethod("CreateContractJSON", args, send, 10_000_000);

      await queryClient.invalidateQueries(["projects"]);

      setIsShowConfirmModal(false);
      setIsShowModal(true);
    } catch (e) {
      let msg = "";
      if (e instanceof Error) {
        msg = e.message;
      } else {
        msg = `${e}`;
      }
      setIsShowConfirmModal(false);
      setToast({
        title: "Error",
        message: msg,
        type: "error",
        mode: "normal",
      });
      throw e;
    } finally {
      setIsProcessing(false);
    }
  };

  const totalFunding = useMemo(() => {
    return milestones.reduce((total, m) => total + +m.amount, 0).toString();
  }, [milestones]);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <ModalBase
        onClose={cancel}
        label="Sign the transaction"
        visible={isShowConfirmModal}
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
            Funding
          </BrandText>

          <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
            {prettyPrice(networkId, totalFunding, pmFeature?.paymentsDenom)}
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
          disabled={isProcessing}
          fullWidth
          text="Confirm and Sign"
          testID="confirm-and-sign"
          onPress={confirmAndSign}
        />

        <SpacerColumn size={2} />

        <SecondaryButton
          fullWidth
          size="M"
          disabled={isProcessing}
          text="Cancel"
          onPress={cancel}
        />

        <SpacerColumn size={2} />
      </ModalBase>

      <ModalBase
        onClose={() => setIsShowModal(false)}
        label="Successful payment"
        visible={isShowModal}
        width={480}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={projectSuccessPaymentPNG}
            style={{
              width: 124,
              height: 124,
              marginVertical: layout.spacing_x3,
            }}
          />

          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            You have successfully created Project: {projectFormData?.name}
          </BrandText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              paddingVertical: layout.spacing_x2,
              marginTop: layout.spacing_x2,
              borderTopColor: neutral33,
              borderTopWidth: 1,
            }}
          >
            <SecondaryButtonOutline
              size="SM"
              text="Back to Project Program"
              backgroundColor={neutral00}
              onPress={() => {
                setIsShowModal(false);
                navigation.navigate("Projects", { network: networkId });
              }}
            />
            <PrimaryButton
              size="SM"
              color={neutralFF}
              text="Publish in Social Feed"
            />
          </View>
        </View>
      </ModalBase>
    </View>
  );
};
