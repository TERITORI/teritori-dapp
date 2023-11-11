import { coin } from "@cosmjs/amino";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useEffect, useState } from "react";
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
import { generateIpfsKey, uploadFileToIPFS } from "../../../../utils/ipfs";
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
    PostCategory.ArtisticAudio
  );
  const { freePostCount } = useUpdateAvailableFreePost(
    selectedNetwork?.id || "",
    PostCategory.ArtisticAudio,
    selectedWallet
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [track, setTrack] = useState<Track>({
    title: "",
    description: "",
    imageURI: "",
    audioURI: "",
  });
  const [audioFile, setAudioFile] = useState<LocalFileData>();
  // const [imageFile, setImageFile] = useState<LocalFileData>()

  // const onUploadImage = async (files: LocalFileData[]) => {
  //   setIsUploading(true);
  //   const uploadedFile = await uploadFileToIPFS({
  //     userKey: userIPFSKey,
  //     file: files[0],
  //     networkId: selectedNetwork?.id || "",
  //     userId,
  //   });
  //   if (!uploadedFile?.url) {
  //     console.error("upload file err : Fail to pin to IPFS");
  //     setToastError({
  //       title: "File upload failed",
  //       message: "Fail to pin to IPFS, please try to Publish again",
  //     });
  //     return;
  //   }
  //   setTrack({ ...track, imageURI: uploadedFile.url });
  //   setImageFile(files[0])
  //   setIsUploading(false);
  // };

  const onUploadAudio = async (files: LocalFileData[]) => {
    setIsUploading(true);
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
    const uploadedFile = await uploadFileToIPFS({
      userKey: userIPFSKey,
      file: files[0],
      networkId: selectedNetwork?.id || "",
      userId,
    });
    if (!uploadedFile?.url) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    setTrack({ ...track, audioURI: uploadedFile.url });
    setAudioFile(files[0]);
    setIsUploading(false);
  };

  const handleTitleTextChange = (text: string) => {
    setTrack({ ...track, title: text.trim() });
  };

  const handleDescriptionTextChange = (text: string) => {
    setTrack({ ...track, description: text.trim() });
  };

  // const handleRemoveAudio = () => {
  //   setTrack({ ...track, audioURI: "" });
  // };

  const processCreatePost = async () => {
    const denom = selectedNetwork?.currencies[0].denom;

    const currentBalance = balances.find((bal) => bal.denom === denom);

    if (postFee > Number(currentBalance?.amount) && !freePostCount) {
      return setNotEnoughFundModal(true);
    }

    try {
      const identifier = uuidv4();
      const msg = {
        category: PostCategory.ArtisticAudio,
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
                    JSON.stringify({ create_post: msg })
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
            { gasWanted: 2_000_000 }
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
  };

  const onPressUpload = async () => {
    setIsLoading(true);
    if (!selectedWallet?.connected || !selectedWallet.address) {
      return;
    }
    await processCreatePost();
    setIsLoading(false);
    onUploadDone();
  };

  useEffect(() => {
    setTrack({
      ...track,
      audioURI: audioFile?.url || "",
      imageURI: audioFile?.thumbnailFileData?.url || "",
    });
  }, [audioFile, track]);

  return (
    <>
      <View style={inputBoxStyle}>
        {/*<View*/}
        {/*  style={[imgBoxStyle, (isUploading || isLoading) && { opacity: 0.5 }]}*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    source={*/}
        {/*      track.imageURI === ""*/}
        {/*        ? DefaultTrackImage*/}
        {/*        : ipfsURLToHTTPURL(track.imageURI)*/}
        {/*    }*/}
        {/*    style={imgStyle}*/}
        {/*  />*/}
        {/*  <View style={uploadImgStyle}>*/}
        {/*    <FileUploader*/}
        {/*      onUpload={onUploadImage}*/}
        {/*      style={uploadButtonStyle}*/}
        {/*      mimeTypes={IMAGE_MIME_TYPES}*/}
        {/*      maxUpload={1}*/}
        {/*      setIsLoading={setIsLoading}*/}
        {/*    >*/}
        {/*      {({ onPress }) => (*/}
        {/*        <TouchableOpacity*/}
        {/*          style={uploadButtonStyle}*/}
        {/*          onPress={onPress}*/}
        {/*          disabled={isUploading || isLoading}*/}
        {/*        >*/}
        {/*          <SVG source={Img} width={16} height={16} />*/}
        {/*          <SpacerRow size={1} />*/}
        {/*          <BrandText style={fontSemibold14}>upload image</BrandText>*/}
        {/*        </TouchableOpacity>*/}
        {/*      )}*/}
        {/*    </FileUploader>*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={handleTitleTextChange}
            label="Track name"
            name="trackName"
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={handleDescriptionTextChange}
            label="Track description"
            name="trackDescription"
          />
        </View>
      </View>

      <SpacerColumn size={2} />
      {audioFile?.url ? (
        <EditableAudioPreview
          file={audioFile}
          onDelete={() => setAudioFile(undefined)}
          onUploadThumbnail={(updatedFile) => setAudioFile(updatedFile)}
        />
      ) : (
        // <View style={unitBoxStyle}>
        //   <View style={oneLineStyle}>
        //     <TouchableOpacity>
        //       <SVG source={List} width={16} height={16} />
        //     </TouchableOpacity>
        //     <SpacerRow size={1.5} />
        //     <BrandText style={fontSemibold14}>{track.title}</BrandText>
        //   </View>
        //   <View style={oneLineStyle}>
        //     <TouchableOpacity onPress={handleRemoveAudio}>
        //       <SVG source={TrashCircle} width={24} height={24} />
        //     </TouchableOpacity>
        //   </View>
        // </View>
        <FileUploader
          onUpload={onUploadAudio}
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
            !track.title ||
            !track.imageURI ||
            !track.audioURI ||
            isUploading ||
            isLoading
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isUploading || isLoading}
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

// const unitBoxStyle: ViewStyle = {
//   backgroundColor: neutral17,
//   paddingHorizontal: layout.spacing_x1_5,
//   flexDirection: "row",
//   alignItems: "center",
//   justifyContent: "space-between",
//   borderRadius: 8,
//   height: 40,
// };
// const oneLineStyle: ViewStyle = {
//   flexDirection: "row",
//   alignItems: "center",
// };
const inputBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
// const imgBoxStyle: ViewStyle = {
//   position: "relative",
// };
// const imgStyle: ImageStyle = {
//   width: 172,
//   height: 172,
//   borderRadius: 8,
// };
const textBoxStyle: ViewStyle = {
  width: "100%",
};

// const uploadImgStyle: ViewStyle = {
//   width: "100%",
//   position: "absolute",
//   left: 0,
//   bottom: layout.spacing_x1,
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
// };
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: 32,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
};
