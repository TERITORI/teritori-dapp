import cosmosHubSVG from "../../assets/icons/networks/cosmos-hub-circle.svg";
import ethereumSVG from "../../assets/icons/networks/ethereum-circle.svg";
import solanaSVG from "../../assets/icons/networks/solana-circle.svg";
import teritoriSVG from "../../assets/icons/networks/teritori-circle.svg";

export enum WalletTitle {
  Solana = "Solana",
  CosmosHub = "Cosmos Hub",
  Teritori = "Teritori",
  Ethereum = "Ethereum",
}

export const getWalletIconFromTitle = (title: string) => {
  switch (title) {
    case "Solana":
      return solanaSVG;
    case "Cosmos Hub":
      return cosmosHubSVG;
    case "Teritori":
      return teritoriSVG;
    case "Ethereum":
      return ethereumSVG;
    default:
      return solanaSVG;
  }
};
