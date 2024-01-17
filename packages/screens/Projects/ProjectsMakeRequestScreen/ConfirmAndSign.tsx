import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useState } from "react";
import { Image, View } from "react-native";
import { useSelector } from "react-redux";

import projectSuccessPaymentPNG from "../../../../assets/project-success-payment.png";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useIpfs } from "../../../hooks/useIpfs";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId, mustGetGnoNetwork } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { adenaVMCall, extractGnoString } from "../../../utils/gno";
import { generateIpfsKey } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  neutralFF,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../../utils/types/files";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { useUtils } from "../hooks/useUtils";

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export const ConfirmAndSign: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);

  const navigation = useAppNavigation();
  const { shortDescData, milestones, teamAndLinkData } = useMakeRequestState();
  const networkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const { mustGetValue } = useUtils();
  const { uploadFilesToPinata } = useIpfs();

  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(networkId, selectedWallet?.address);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { setToastError } = useFeedbacks();

  const uploadFile = async (fileToUpload: LocalFileData) => {
    setIsUploadingImage(true);

    let remoteFiles: RemoteFileData[] = [];

    const pinataJWTKey = userIPFSKey || (await generateIpfsKey("gno", userId));
    if (pinataJWTKey) {
      remoteFiles = await uploadFilesToPinata({
        files: [fileToUpload],
        pinataJWTKey,
      });
    }

    if (!remoteFiles.find((file) => file.url)) {
      const message = "Fail to pin to IPFS, please try to Publish again";
      setToastError({
        title: "File upload failed",
        message,
      });
      setIsUploadingImage(false);
      throw Error(message);
    }

    setIsUploadingImage(false);
    return `${PINATA_GATEWAY}/${remoteFiles[0].url.replace("ipfs://", "")}`;
  };

  const confirmAndSign = async () => {
    if (!shortDescData._coverImgFile) {
      setToastError({
        title: "Warning",
        message: "Cover Image is mandatory",
      });
      throw Error("cover image file is required");
    }

    const coverImg = await uploadFile(shortDescData._coverImgFile);

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const caller = mustGetValue(wallet?.address, "caller");
    const escrowPkgPath = mustGetValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );
    const escrowToken = mustGetValue(
      shortDescData?.paymentAddr,
      "payment address",
    );

    const milestoneTitles = milestones.map((m) => m.title).join(",");
    const milestoneAmounts = milestones.map((m) => m.amount).join(",");
    const milestoneDescs = milestones.map((m) => m.desc).join(",");
    const milestoneDurations = milestones.map((m) => m.duration).join(",");
    const milestoneLinks = milestones.map((m) => m.link).join(",");
    const milestonePriorities = milestones.map((m) => m.priority).join(",");

    const expiryDuration =
      "" + milestoneDurations.split(",").reduce((total, m) => total + +m, 0);

    // Update the coverImg
    shortDescData.coverImg = coverImg || "";
    shortDescData._coverImgFile = undefined;

    const metadata = JSON.stringify({
      shortDescData,
      teamAndLinkData,
    });

    const contractor = shortDescData.contractor || "";
    const funder = shortDescData.funder || "";
    const conflictHandler = "";

    if (!contractor && !funder) {
      return setToastError({
        title: "Error",
        message: "Contract and Funder cannot be both empty",
      });
    }

    try {
      // If creator = funder then we need to send all needed fund
      if (caller === funder) {
        // Approve Escrow to send the needed foo20 fund
        // Get Escrow realm Address
        const provider = new GnoJSONRPCProvider(gnoNetwork.endpoint);

        const escrowAddress = extractGnoString(
          await provider.evaluateExpression(escrowPkgPath, `CurrentRealm()`),
        );

        await adenaVMCall(
          networkId,
          {
            caller,
            send: "",
            pkg_path: escrowToken,
            func: "Approve",
            args: [escrowAddress, "" + shortDescData.budget], // Decimal of gopher20 = 4
          },
          { gasWanted: 1_000_000 },
        );
      }

      // Create the contract
      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "CreateContract",
          args: [
            contractor,
            funder,
            escrowToken,
            metadata,
            expiryDuration,
            milestoneTitles,
            milestoneDescs,
            milestoneAmounts,
            milestoneDurations,
            milestoneLinks,
            milestonePriorities,
            conflictHandler,
          ],
        },
        { gasWanted: 2_000_000 },
      );

      setIsShowModal(true);
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      {isUploadingImage && (
        <BrandText style={[fontSemibold14]}>Uploading Cover Image...</BrandText>
      )}

      {shortDescData.funder && (
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          Funder:{" "}
          {shortDescData.funder === selectedWallet?.address
            ? "Me"
            : shortDescData.funder}
        </BrandText>
      )}

      {shortDescData.contractor && (
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          Contractor:{" "}
          {shortDescData.contractor === selectedWallet?.address
            ? "Me"
            : shortDescData.contractor}
        </BrandText>
      )}

      <SpacerColumn size={2} />

      <PrimaryButton
        disabled={isUploadingImage}
        text="Confirm and Sign"
        onPress={confirmAndSign}
      />

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
            You have successfully created Project: {shortDescData?.name}
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
                navigation.navigate("Projects");
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
