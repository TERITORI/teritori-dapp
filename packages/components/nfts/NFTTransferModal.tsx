import { bech32 } from "bech32";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";

import { NFTTransferForm } from "./types";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriNftClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriNft__factory } from "../../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkKind,
  CosmosNetworkInfo,
  EthereumNetworkInfo,
  getKeplrSigningCosmWasmClient,
  getNetwork,
  parseNftId,
} from "../../networks";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

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
  const networkId = nft?.networkId;
  const network = getNetwork(networkId);
  const networkKind = network?.kind;
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { handleSubmit: formHandleSubmit, control } =
    useForm<NFTTransferForm>();

  const cosmosSendNFT = async (
    nftContractAddress: string,
    tokenId: string,
    sender: string,
    receiver: string,
    networkInfo: CosmosNetworkInfo,
  ) => {
    // validate address
    const address = bech32.decode(receiver);

    if (address.prefix !== networkInfo.addressPrefix) {
      throw Error("Bad address prefix");
    }

    // create client
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      networkInfo.id,
    );
    const nftClient = new TeritoriNftClient(
      signingComswasmClient,
      sender,
      nftContractAddress,
    );

    // transfer
    await nftClient.transferNft({
      recipient: receiver,
      tokenId,
    });
  };

  const ethereumSendNFT = async (
    network: EthereumNetworkInfo,
    nftContractAddress: string,
    tokenId: string,
    sender: string,
    receiver: string,
  ) => {
    const signer = await getMetaMaskEthereumSigner(network, sender);
    if (!signer) {
      throw Error("Unable to get signer");
    }

    const nftClient = await TeritoriNft__factory.connect(
      nftContractAddress,
      signer,
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

      const [network, , tokenId] = parseNftId(nft.id);

      if (
        ![NetworkKind.Ethereum, NetworkKind.Cosmos].includes(
          network?.kind || NetworkKind.Unknown,
        )
      ) {
        throw Error(`Network not supported`);
      }

      // check for sender
      const sender = selectedWallet?.address;
      if (!sender) {
        throw Error(`No sender`);
      }

      // check for network
      if (!network) {
        throw Error(`No network`);
      }

      switch (network.kind) {
        case NetworkKind.Cosmos:
          await cosmosSendNFT(
            nft.nftContractAddress,
            tokenId,
            sender,
            formValues.receiverAddress,
            network,
          );
          break;
        case NetworkKind.Ethereum:
          await ethereumSendNFT(
            network,
            nft.nftContractAddress,
            tokenId,
            sender,
            formValues.receiverAddress,
          );
          break;
        default:
          throw Error(`unsupported network kind ${networkKind}`);
      }

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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  image: { height: 223, width: 223, borderRadius: 12 },
  detailContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: layout.spacing_x4,
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
