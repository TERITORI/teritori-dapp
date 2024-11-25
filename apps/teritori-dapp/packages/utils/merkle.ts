import { SHA256 } from "crypto-js";
import { MerkleTree } from "merkletreejs";

export const computeMerkleRoot = (elements: string[]): string => {
  const leaves = elements.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  return root;
};
