import { getCosmosBalances } from "./cosmos";

const teriDenom = "stake";

export const getTeriBalance = async (address: string) => {
  const cosmosBalances = await getCosmosBalances(address);
  return cosmosBalances.balances
    .filter((balance) => balance.denom === teriDenom)
    .reduce((total, balance) => total + parseInt(balance.amount, 10), 0);
};
