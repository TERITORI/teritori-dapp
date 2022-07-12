import { Metaplex } from "@metaplex-foundation/js-next";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const metaplex = new Metaplex(connection);

export const getSolanaBalance = async (address: string) => {
  const solpk = new PublicKey(address);
  return await connection.getBalance(solpk);
};

export const getSolanaOwnedNFTS = async (ownerAddress: string) => {
  const ownerPK = new PublicKey(ownerAddress);
  return await metaplex.nfts().findNftsByOwner(ownerPK);
};
