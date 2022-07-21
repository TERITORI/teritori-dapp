import { getCosmosBalances } from "./cosmos";

export const UTORI_PER_TORI = 1000000;

const teriDenom = "utori";

export const getUtoriBalance = async (address: string) => {
  const cosmosBalances = await getCosmosBalances(address);
  return cosmosBalances.balances
    .filter((balance) => balance.denom === teriDenom)
    .reduce((total, balance) => total + parseInt(balance.amount, 10), 0);
};
