import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.testnet.solana.com");

export const getSolanaBalance = async (address: string) => {
  const solpk = new PublicKey(address);
  return await connection.getBalance(solpk);
};
