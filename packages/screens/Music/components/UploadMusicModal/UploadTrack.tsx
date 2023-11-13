import { coin } from "@cosmjs/amino";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useState } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import Add from "../../../../../assets/icons/add-primary.svg";
import { signingSocialFeedClient } from "../../../../client-creators/socialFeedClient";
import { BrandText } from "../../../../components/BrandText";
import { EditableAudioPreview } from "../../../../components/FilePreview/EditableAudioPreview";
import { SVG } from "../../../../components/SVG";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { FileUploader } from "../../../../components/fileUploader";
import { TextInputCustom } from "../../../../components/inputs/TextInputCustom";
import { PostCategory } from "../../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { NotEnoughFundModal } from "../../../../components/socialFeed/NewsFeed/NotEnoughFundModal";
import { TERITORI_FEED_ID } from "../../../../components/socialFeed/const";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { useFeedbacks } from "../../../../context/FeedbacksProvider";
import { useIsDAO } from "../../../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useDAOMakeProposal } from "../../../../hooks/dao/useDAOMakeProposal";
import { useCreatePost } from "../../../../hooks/feed/useCreatePost";
import { useUpdateAvailableFreePost } from "../../../../hooks/feed/useUpdateAvailableFreePost";
import { useUpdatePostFee } from "../../../../hooks/feed/useUpdatePostFee";
import { useBalances } from "../../../../hooks/useBalances";
import { useSelectedNetworkInfo } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import {
  getUserId,
  mustGetCosmosNetwork,
  NetworkKind,
} from "../../../../networks";
import { selectNFTStorageAPI } from "../../../../store/slices/settings";
import { defaultSocialFeedFee } from "../../../../utils/fee";
import { adenaDoContract } from "../../../../utils/gno";
import { generateIpfsKey, uploadFilesToPinata } from "../../../../utils/ipfs";
import { AUDIO_MIME_TYPES } from "../../../../utils/mime";
import {
  neutral30,
  neutral33,
  neutral77,
  primaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { LocalFileData } from "../../../../utils/types/files";
import { Track } from "../../../../utils/types/music";

interface Props {
  onUploadDone: () => void;
}

const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const UploadTrack: React.FC<Props> = ({ onUploadDone }) => {
  const { setToastError } = useFeedbacks();
  const selectedNetwork = useSelectedNetworkInfo();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetwork?.id, selectedWallet?.address);
  const { isDAO } = useIsDAO(userId);
  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const balances = useBalances(selectedNetwork?.id, selectedWallet?.address);

  const makeProposal = useDAOMakeProposal(isDAO ? userId : undefined);
  const { mutateAsync, isLoading: isMutateLoading } = useCreatePost({
    onSuccess: () => {
      onUploadDone();
    },
  });
  const { postFee } = useUpdatePostFee(
    selectedNetwork?.id || "",
    PostCategory.MusicAudio,
  );
  const { freePostCount } = useUpdateAvailableFreePost(
    selectedNetwork?.id || "",
    PostCategory.MusicAudio,
    selectedWallet,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localAudioFile, setLocalAudioFile] = useState<LocalFileData>();

  const processCreatePost = async (track: Track) => {
    const denom = selectedNetwork?.currencies[0].denom;
    const currentBalance = balances.find((bal) => bal.denom === denom);
    if (postFee > Number(currentBalance?.amount) && !freePostCount) {
      return setNotEnoughFundModal(true);
    }
    try {
      const identifier = uuidv4();
      const msg = {
        category: PostCategory.MusicAudio,
        identifier,
        metadata: JSON.stringify(track),
      };

      if (isDAO) {
        const network = mustGetCosmosNetwork(selectedNetwork?.id);

        if (!network.socialFeedContractAddress) {
          throw new Error("Social feed contract address not found");
        }
        if (!selectedWallet?.address) {
          throw new Error("Invalid sender");
        }
        await makeProposal(selectedWallet?.address, {
          title: "Post on feed",
          description: "",
          msgs: [
            {
              wasm: {
                execute: {
                  contract_addr: network.socialFeedContractAddress,
                  msg: Buffer.from(
                    JSON.stringify({ create_post: msg }),
                  ).toString("base64"),
                  funds: [{ amount: postFee.toString(), denom: "utori" }],
                },
              },
            },
          ],
        });
      } else {
        if (selectedNetwork?.kind === NetworkKind.Gno) {
          const vmCall = {
            caller: selectedWallet?.address || "",
            send: "",
            pkg_path: selectedNetwork.socialFeedsPkgPath,
            func: "CreatePost",
            args: [
              TERITORI_FEED_ID,
              "0",
              msg.category.toString(),
              msg.metadata,
            ],
          };

          const txHash = await adenaDoContract(
            selectedNetwork.id,
            [{ type: "/vm.m_call", value: vmCall }],
            { gasWanted: 2_000_000 },
          );

          const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);
          await provider.waitForTransaction(txHash);
        } else {
          const client = await signingSocialFeedClient({
            networkId: selectedNetwork?.id || "",
            walletAddress: selectedWallet?.address || "",
          });
          await mutateAsync({
            client,
            msg,
            args: {
              fee: defaultSocialFeedFee,
              memo: "",
              funds: [coin(postFee, "utori")],
            },
          });
        }
      }
    } catch (err) {
      console.error("post submit err", err);
      setToastError({
        title: "Post creation failed",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
    setIsUploading(false);
  };

  const onPressUpload = async () => {
    setIsLoading(true);
    if (
      !selectedWallet?.connected ||
      !selectedWallet.address ||
      !localAudioFile
    ) {
      return;
    }
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetwork?.id || "", userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToastError({
        title: "File upload failed",
        message: "No Pinata JWT",
      });
      return;
    }
    const uploadedFiles = await uploadFilesToPinata({
      pinataJWTKey,
      files: localAudioFile.thumbnailFileData
        ? [localAudioFile, localAudioFile.thumbnailFileData]
        : [localAudioFile],
    });
    if (!uploadedFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    const audio =
      uploadedFiles[0].fileType === "audio"
        ? uploadedFiles[0]
        : uploadedFiles[1];
    const image =
      uploadedFiles[0].fileType === "image"
        ? uploadedFiles[0]
        : uploadedFiles[1];
    await processCreatePost({
      title,
      description,
      audioURI: audio.url,
      imageURI: image.url,
      waveform: audio.audioMetadata?.waveform || [],
      duration: audio.audioMetadata?.duration || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsLoading(false);
    onUploadDone();
  };

  return (
    <>
      {isNotEnoughFundModal && (
        <NotEnoughFundModal
          visible
          onClose={() => setNotEnoughFundModal(false)}
        />
      )}

      <View style={inputBoxStyle}>
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setTitle(text)}
            label="Track name"
            name="trackName"
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={(text) => setDescription(text)}
            label="Track description"
            name="trackDescription"
          />
        </View>
      </View>

      <SpacerColumn size={2} />
      {localAudioFile?.url ? (
        <EditableAudioPreview
          file={localAudioFile}
          onDelete={() => setLocalAudioFile(undefined)}
          onUploadThumbnail={(updatedFile) => setLocalAudioFile(updatedFile)}
        />
      ) : (
        <FileUploader
          onUpload={(files) => setLocalAudioFile(files[0])}
          style={uploadButtonStyle}
          mimeTypes={AUDIO_MIME_TYPES}
          setIsLoading={setIsLoading}
        >
          {({ onPress }) => (
            <TouchableOpacity
              style={[
                buttonContainerStyle,
                (isUploading || isLoading) && { opacity: 0.5 },
              ]}
              onPress={onPress}
              disabled={isUploading || isLoading}
            >
              <SVG source={Add} width={20} height={20} stroke={primaryColor} />
              <SpacerRow size={1} />
              <BrandText style={buttonTextStyle}>Add audio</BrandText>
            </TouchableOpacity>
          )}
        </FileUploader>
      )}
      <SpacerColumn size={2.5} />

      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
          },
        ]}
      >
        Provide FLAC, WAV or AIFF for highest audio quality.
      </BrandText>
      <SpacerColumn size={2.5} />

      <View style={divideLineStyle} />

      <View style={footerStyle}>
        <BrandText style={footerTextStyle} numberOfLines={2}>
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={
            !localAudioFile?.url ||
            !title ||
            !description ||
            isUploading ||
            isMutateLoading ||
            isLoading
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isUploading || isLoading || isMutateLoading}
        />
      </View>
    </>
  );
};

const buttonContainerStyle: ViewStyle = {
  marginTop: layout.spacing_x2_5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: 999,
  backgroundColor: neutral30,
  marginBottom: layout.spacing_x2,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  width: UPLOAD_ALBUM_MODAL_WIDTH - 2,
  marginLeft: -layout.spacing_x2_5,
  backgroundColor: neutral33,
};
const footerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: layout.spacing_x2_5,
  paddingVertical: layout.spacing_x2,
};
const footerTextStyle: TextStyle = {
  ...fontSemibold14,

  color: neutral77,
  width: "55%",
};
const inputBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
const textBoxStyle: ViewStyle = {
  width: "100%",
};
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: 32,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
};
