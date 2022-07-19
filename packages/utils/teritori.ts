import { getCosmosBalances } from "./cosmos";

const teriDenom = "stake";

export const getTeriBalance = async (address: string) => {
  const cosmosBalances = await getCosmosBalances(address);
  return cosmosBalances.balances
    .filter((balance) => balance.denom === teriDenom)
    .reduce((total, balance) => total + parseInt(balance.amount, 10), 0);
};

// You can add, remove or modify the domains and their status (See DomainsAvailability in NSBHomeScreen.tsx)
export const domainsList = [
  {
    // Displayed name
    name: ".teritori",
    // Is the domains can be minted ? Or just displayed as a "future available domain" (Doesn't exist yet)
    comingSoon: false,
    // Is the domain minted ? (To be true, comingSoon=false necessary) (I don't talk about "availability" to avoid confusion)
    minted: false
  },
  {
    name: ".tori",
    comingSoon: false,
    minted: false
  },
  {
    name: ".osmo",
    comingSoon: true,
    minted: false
  },
  {
    name: ".atom",
    comingSoon: true,
    minted: false
  },
  {
    name: ".juno",
    comingSoon: true,
    minted: false
  }
]