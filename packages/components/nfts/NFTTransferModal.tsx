import { bech32 } from "bech32";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriNftClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriNft__factory } from "../../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkInfo } from "../../networks";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { Network } from "../../utils/network";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";
import { NFTTransferForm } from "./types";

interface NFTTransferModalProps {
  nft?: NFT;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (form: NFTTransferForm) => void;
}

export const NFTTransferModal: React.FC<NFTTransferModalProps> = ({
  isVisible,
  onClose,
  nft,
  onSubmit,
}) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetwork = selectedNetworkInfo?.network;
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { handleSubmit: formHandleSubmit, control } =
    useForm<NFTTransferForm>();

  const teritoriSendNFT = async (
    nftContractAddress: string,
    tokenId: string,
    sender: string,
    receiver: string,
    networkInfo: NetworkInfo
  ) => {
    // validate address
    const address = bech32.decode(receiver);

    if (address.prefix !== networkInfo.addressPrefix) {
      throw Error("Bad address prefix");
    }

    // create client
    const signingComswasmClient = await getSigningCosmWasmClient();
    const nftClient = new TeritoriNftClient(
      signingComswasmClient,
      sender,
      nftContractAddress
    );

    // transfer
    await nftClient.transferNft({
      recipient: receiver,
      tokenId,
    });
  };

  const ethereumSendNFT = async (
    nftContractAddress: string,
    tokenId: string,
    sender: string,
    receiver: string,
    networkInfo: NetworkInfo
  ) => {
    const signer = await getMetaMaskEthereumSigner(sender);
    if (!signer) {
      throw Error("Unable to get signer");
    }

    const nftClient = await TeritoriNft__factory.connect(
      nftContractAddress,
      signer
    );

    const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();
    const tx = await nftClient.transferFrom(sender, receiver, tokenId, {
      maxFeePerGas: maxFeePerGas?.toNumber(),
      maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
    });

    await tx.wait();
  };

  const handleSubmit: SubmitHandler<NFTTransferForm> = async (formValues) => {
    try {
      if (!nft) {
        throw Error(`No NFT selected`);
      }

      const nftPrefix = nft.id.split("-")[0] || "";

      if (!["tori", "eth"].includes(nftPrefix)) {
        throw Error(`Network not supported`);
      }

      // check for sender
      const sender = selectedWallet?.address;
      if (!sender) {
        throw Error(`No sender`);
      }

      // check for network
      if (!selectedNetwork) {
        throw Error(`No network`);
      }

      // get token id
      const tokenId = nft.id.split("-").slice(2).join("-");

      let sendNFTFunc: CallableFunction | null = null;
      switch (selectedNetwork) {
        case Network.Teritori:
          sendNFTFunc = teritoriSendNFT;
          break;
        case Network.Ethereum:
          sendNFTFunc = ethereumSendNFT;
          break;
      }

      if (!sendNFTFunc) {
        throw Error(`Unsupported network ${selectedNetwork}`);
      }

      await sendNFTFunc(
        nft.nftContractAddress,
        tokenId,
        sender,
        formValues.receiverAddress,
        selectedNetworkInfo
      );

      setToastSuccess({
        title: "NFT transfered",
        message: "",
      });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Transfer failed",
          message: err.message,
        });
      }
    }
    onClose();
  };

  // returns
  return (
    <ModalBase
      width={456}
      label="Transfer my NFT"
      visible={isVisible}
      onClose={onClose}
    >
      <View style={styles.detailContainer}>
        <Image source={{ uri: nft?.imageUri }} style={styles.image} />
        <SpacerColumn size={2} />
        <BrandText style={fontSemibold14}>{nft?.name}</BrandText>
        <SpacerColumn size={1.5} />
        <View style={styles.rowCenter}>
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            {nft?.collectionName}
          </BrandText>
        </View>
      </View>

      <TextInputCustom<NFTTransferForm>
        control={control}
        variant="labelOutside"
        name="receiverAddress"
        label="Receiver Address"
        rules={{ required: true }}
        labelStyle={{ color: secondaryColor }}
      />
      <SpacerColumn size={2} />
      <BrandText style={styles.estimatedText}>
        Estimated Time: 6 Seconds
      </BrandText>
      <SpacerColumn size={1} />
      <PrimaryButton
        size="M"
        text="Transfer"
        fullWidth
        loader
        onPress={formHandleSubmit(handleSubmit)}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  image: { height: 223, width: 223, borderRadius: 12 },
  detailContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: layout.padding_x4,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  estimatedText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});
