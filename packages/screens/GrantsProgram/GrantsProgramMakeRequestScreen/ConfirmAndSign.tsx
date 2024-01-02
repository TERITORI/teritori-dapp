import React, { useState } from "react";
import { Image, View } from "react-native";
import { useSelector } from "react-redux";

import grantSuccessPaymentPNG from "../../../../assets/grant-success-payment.png";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import ModalBase from "../../../components/modals/ModalBase";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId, mustGetGnoNetwork } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import { adenaVMCall } from "../../../utils/gno";
import { generateIpfsKey, uploadFilesToPinata } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral33,
  neutral77,
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
  const { mustHaveValue } = useUtils();

  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(networkId, selectedWallet?.address);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { setToastError } = useFeedbacks();

  const uploadFile = async (fileToUpload: LocalFileData) => {
    let remoteFiles: RemoteFileData[] = [];

    const pinataJWTKey = userIPFSKey || (await generateIpfsKey("gno", userId));
    if (pinataJWTKey) {
      remoteFiles = await uploadFilesToPinata({
        files: [fileToUpload],
        pinataJWTKey,
      });
    }

    if (!remoteFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }

    return `${PINATA_GATEWAY}/${remoteFiles[0].url}`;
  };

  const confirmAndSign = async () => {
    if (!shortDescData._coverImgFile) {
      setToastError({
        title: "Warning",
        message: "Cover Image is mandatory",
      });
      throw Error("cover image file is required");
    }

    setIsUploadingImage(true);
    const coverImg = await uploadFile(shortDescData._coverImgFile);
    setIsUploadingImage(false);

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const caller = mustHaveValue(wallet?.address, "caller");
    const escrowPkgPath = mustHaveValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );
    const escrowToken = mustHaveValue(
      shortDescData?.paymentAddr,
      "payment address",
    );

    const milestoneTitles = milestones.map((m) => m.name).join(",");
    const milestoneAmounts = milestones.map((m) => m.budget).join(",");
    const milestoneDurations = milestones.map((m) => "1000").join(",");
    const milestoneLinks = milestones.map((m) => m.githubLink).join(",");

    const expiryDuration =
      "" + milestoneDurations.split(",").reduce((total, m) => total + +m, 0);

    // Update the coverImg
    shortDescData.coverImg = coverImg || "";

    const metadata = JSON.stringify({
      shortDescData,
      milestones,
      teamAndLinkData,
    });

    const contractor = caller;
    const funder = caller;
    const conflictHandler = "";

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
          milestoneAmounts,
          milestoneDurations,
          milestoneLinks,
          conflictHandler,
        ],
      },
      { gasWanted: 2_000_000 },
    );

    setIsShowModal(true);
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
            source={grantSuccessPaymentPNG}
            style={{
              width: 124,
              height: 124,
              marginVertical: layout.spacing_x3,
            }}
          />

          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            You have successfully paid and created {shortDescData?.name} Grant.
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
              text="Back to Grant Program"
              backgroundColor={neutral00}
              onPress={() => {
                setIsShowModal(false);
                navigation.navigate("GrantsProgram");
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
