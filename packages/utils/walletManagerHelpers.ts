import cosmosHubSVG from "../../assets/icons/cosmos-hub-circle.svg";
import solanaSVG from "../../assets/icons/solana-circle.svg";
import teritoriSVG from "../../assets/icons/teritori.svg";
import terraSVG from "../../assets/icons/terra-circle.svg";

export const getWalletIconFromTitle = (title: string) => {
  switch (title) {
    case "Solana":
      return solanaSVG;
    case "Cosmos Hub":
      return cosmosHubSVG;
    case "Teritori":
      return teritoriSVG;
    case "Terra":
      return terraSVG;
    default:
      return solanaSVG;
  }
};

export const getWalletPieColor = (title: string): string => {
  switch (title) {
    case "Solana":
      return "#16BBFF";
    case "Cosmos Hub":
      return "#5C26F5";
    default:
      return "black";
  }
};
