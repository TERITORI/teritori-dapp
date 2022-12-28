import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, Signer } from "ethers";

export const getMetaMaskEthereumProvider = async () => {
  const provider = await detectEthereumProvider();
  if (!provider) return null;

  return new ethers.providers.Web3Provider(provider);
};

export const getMetaMaskEthereumSigner = async () => {
  const provider = await getMetaMaskEthereumProvider();
  if (!provider) return null;

  // Force type to be compatible with contract client generated from typechain
  // web3Provider.getSigner() returns JsonRpcSigner which  extends from Signer
  return provider.getSigner() as Signer;
};
