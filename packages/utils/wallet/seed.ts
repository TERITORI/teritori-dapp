import * as bip39 from "bip39";

export interface Seed {
  derivation: string;
  mnemonic: string;
}

export function createMnemonic(numberOfWords: 12 | 24 = 24): string {
  if (numberOfWords === 12) return bip39.generateMnemonic(128);
  return bip39.generateMnemonic(256);
}

export const correctMnemonic = (s: string) => s.trim().split(/\s+/).join(" ");
