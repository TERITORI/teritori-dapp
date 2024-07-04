import { EthereumNetworkInfo, getCollectionId, getUserId } from "@/networks";
import { getEthereumProvider } from "./ethereum";
import { TeritoriMinter__factory } from "@/evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { web3ToWeb2URI } from "./ipfs";
import { NFTAttribute, NFTInfo } from "./types/nft";
import { NFTVault__factory } from "@/evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import { TeritoriNft__factory } from "@/evm-contracts-clients/teritori-nft/TeritoriNft__factory";

export const getEthereumStandardNFTInfo = async (
  network: EthereumNetworkInfo,
  minterContractAddress: string,
  tokenId: string,
  userId: string | undefined,
) => {
  const provider = await getEthereumProvider(network);
  if (!provider) {
    throw Error("unable to get ethereum provider");
  }
  const minterClient = TeritoriMinter__factory.connect(
    minterContractAddress,
    provider,
  );

  const nftAddress = await minterClient.callStatic.nft();

  const nftClient = TeritoriNft__factory.connect(nftAddress, provider);
  const collectionName = await nftClient.callStatic.name();
  const contractURI = await nftClient.callStatic.contractURI();

  // NOTE: For some reason, deployed contract is missing contractURI so we set metadata to empty
  // instead of blocking process here
  const collectionMetadata = contractURI
    ? await fetch(contractURI).then((data) => data.json())
    : {};

  // TokenURI must be fetched from deployed NFT
  const deployedNftClient = TeritoriNft__factory.connect(nftAddress, provider);
  const tokenURI = await deployedNftClient.tokenURI(tokenId);
  const metadataURL = web3ToWeb2URI(tokenURI);
  const metadata = await fetch(metadataURL).then((data) => data.json());
  const attributes: NFTAttribute[] = [];
  for (const attr of metadata.attributes) {
    attributes.push({ trait_type: attr.trait_type, value: attr.value });
  }
  const vaultClient = NFTVault__factory.connect(
    network.vaultContractAddress,
    provider,
  );
  const feeNumerator = await vaultClient.callStatic.feeNumerator();
  const feeDenominator = await vaultClient.callStatic.feeDenominator();
  const royalties = feeNumerator.toNumber() / feeDenominator.toNumber();
  const saledNft = await vaultClient.callStatic.nftSales(nftAddress, tokenId);
  let isListed = false;
  let vaultInfo: any = {}; // TODO: Get vault info

  let ownerAddress = await deployedNftClient.callStatic.ownerOf(tokenId);
  if (+saledNft.owner !== 0) {
    isListed = true;
    vaultInfo = {
      amount: saledNft.saleOption.amount.toBigInt(),
      denom: saledNft.saleOption.token,
    };
    ownerAddress = saledNft.owner.toLowerCase();
  }

  const isOwner = userId === getUserId(network.id, ownerAddress);

  const nfo: NFTInfo = {
    name: metadata.name,
    description: metadata.description,
    attributes,
    nftAddress,
    mintAddress: minterContractAddress,
    imageURL: metadata.image,
    tokenId,
    ownerAddress,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName,
    collectionImageURL: collectionMetadata.image,
    mintDenom: network.currencies[0].denom,
    royalty: royalties,
    breedingsAvailable: 0,
    networkId: network.id,
    collectionId: getCollectionId(network.id, minterContractAddress),
  };

  return nfo;
};
