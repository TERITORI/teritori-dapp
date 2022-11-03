import cosmosHubSVG from "../../assets/icons/networks/cosmos-hub-circle.svg";
import solanaSVG from "../../assets/icons/networks/solana-circle.svg";
import teritoriSVG from "../../assets/icons/networks/teritori-circle.svg";

export const getWalletIconFromTitle = (title: string) => {
  switch (title) {
    case "Solana":
      return solanaSVG;
    case "Cosmos Hub":
      return cosmosHubSVG;
    case "Teritori":
      return teritoriSVG;
    default:
      return solanaSVG;
  }
};
