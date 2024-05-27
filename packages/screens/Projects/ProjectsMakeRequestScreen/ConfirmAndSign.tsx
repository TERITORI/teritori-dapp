import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Image, View } from "react-native";

import gnoSVG from "../../../../assets/icons/networks/gno.svg";
import projectSuccessPaymentPNG from "../../../../assets/project-success-payment.png";
import ModalBase from "../../../components/modals/ModalBase";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { Tag } from "../components/Milestone";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { useUtils } from "../hooks/useUtils";
import { ProjectShortDescData, ProjectTeamAndLinkData } from "../types";

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
import { useIpfs } from "@/hooks/useIpfs";
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
import { LocalFileData } from "@/utils/types/files";

export const ConfirmAndSign: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(true);

  const navigation = useAppNavigation();
  const {
    projectFormData,
    milestones,
    teamAndLinkData: teamAndLinkFormData,
  } = useMakeRequestState();
  const networkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const { mustGetValue } = useUtils();
  const { uploadToIPFS } = useIpfs();

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

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { setToastError } = useFeedbacks();

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );

  const queryClient = useQueryClient();

  const uploadFile = async (fileToUpload: LocalFileData) => {
    setIsUploadingImage(true);
    try {
      if (!selectedWallet) {
        throw Error("Wallet not found");
      }
      const web3URI = await uploadToIPFS(selectedWallet.userId, fileToUpload);
      return web3URI;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const cancel = async () => {
    setIsShowConfirmModal(false);
    navigation.replace("Projects", { network: networkId });
  };

  const confirmAndSign = async () => {
    try {
      if (!projectFormData.coverImg) {
        setIsShowConfirmModal(false);
        throw Error("Cover image file is required");
      }

      if (!pmFeature) {
        throw Error("Project manager feature not found");
      }

      const coverImg = await uploadFile(projectFormData.coverImg);

      const caller = mustGetValue(wallet?.address, "caller");
      const expiryDuration =
        "" + milestones.reduce((total, m) => total + +m.duration, 0);

      const shortDescData: ProjectShortDescData = {
        name: projectFormData.name,
        desc: projectFormData.desc,
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

      const contractor = projectFormData.contractor;
      const funder = projectFormData.funder;
      const conflictHandler = projectFormData.arbitrator;

      if (!contractor && !funder) {
        return setToastError({
          title: "Error",
          message: "Contract and Funder cannot be both empty",
        });
      }

      let send = "";
      // If creator = funder then we need to send all needed fund
      if (caller === funder) {
        send = totalFunding + pmFeature.paymentsDenom;
      }

      console.log("executing contract creation");

      await execEscrowMethod(
        "CreateContractJSON",
        [
          contractor,
          funder,
          pmFeature.paymentsDenom,
          metadata,
          expiryDuration,
          JSON.stringify(milestones),
          conflictHandler,
        ],
        send,
        10_000_000,
      );

      await queryClient.invalidateQueries(["projects"]);

      setIsShowConfirmModal(false);
      setIsShowModal(true);
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
      throw e;
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

        {isUploadingImage && (
          <BrandText style={[fontSemibold14]}>
            Uploading Cover Image...
          </BrandText>
        )}

        <SpacerColumn size={2} />

        <PrimaryButton
          fullWidth
          disabled={isUploadingImage}
          text="Confirm and Sign"
          testID="confirm-and-sign"
          onPress={confirmAndSign}
        />

        <SpacerColumn size={2} />

        <SecondaryButton
          fullWidth
          size="M"
          disabled={isUploadingImage}
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
