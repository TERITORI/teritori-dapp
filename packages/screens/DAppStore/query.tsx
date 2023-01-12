import checklogo from "../../../assets/icons/greenCheck.svg";
import placeHolder from "../../../assets/icons/info.svg";
import logoSimple from "../../../assets/icons/logo-simple.svg";
import atomSVG from "../../../assets/icons/networks/cosmos-hub.svg";
import osmosisSVG from "../../../assets/icons/networks/osmosis.svg";
import teritoriSVG from "../../../assets/icons/networks/teritori.svg";
import otherAppsIcon from "../../../assets/icons/random-goods-icon.svg";
import warningTriangle from "../../../assets/icons/warning-triangle-orange.svg";
import axelarLogo from "../../../assets/logos/Axelar-logo.svg";
import astroportLogo from "../../../assets/logos/astroport.svg";
import coinHallLogo from "../../../assets/logos/coinhall.svg";
import falconWalletLogo from "../../../assets/logos/falconWallet.svg";
import pulsarLogo from "../../../assets/logos/pulsar-logo.svg";
import { dAppGroup } from "./types";

export function getAvailableApps(): dAppGroup {
  return {
    "teritori-core-apps": {
      id: "teritori-core-apps",
      groupName: "Teritori Core dApps",
      icon: teritoriSVG,
      options: {
        "tori-marketplace": {
          id: "tori-marketplace",
          title: "Marketplace",
          description: "NFT Marketplace",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "teritori-core-apps",
        },
        Launchpad: {
          id: "Launchpad",
          title: "Launchpad",
          description: "Multi Network NFT Launcher",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "teritori-core-apps",
        },
        OrgDeployer: {
          id: "OrgDeployer",
          title: "Org Deployer",
          description: "Coming soon!",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "teritori-core-apps",
        },
      },
    },
    "top-apps": {
      id: "top-apps",
      groupName: "Top Apps",
      icon: checklogo,
      options: {
        Osmosis: {
          id: "Osmosis",
          title: "Osmosis Dex",
          description: "Advanced automated market maker (AMM)",
          icon: osmosisSVG,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        astroport: {
          id: "astroport",
          title: "Astroport",
          description: "Powerful DEX",
          icon: astroportLogo,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        pulsar: {
          id: "pulsar",
          title: "Pulsar",
          description: "All-in-one dashboard",
          icon: pulsarLogo,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        axelar: {
          id: "axelar",
          title: "Axelar Network",
          description: "Secure building",
          icon: axelarLogo,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        coinhall: {
          id: "coinhall",
          title: "Coinhall",
          description: "Real-time price charts",
          icon: coinHallLogo,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        falcon: {
          id: "falcon",
          title: "Falcon Wallet",
          description: "Secure interchain wallet",
          icon: falconWalletLogo,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
      },
    },
    "external-id": {
      id: "external-id",
      groupName: "External & Permissionless dApps",
      icon: warningTriangle,
      options: {
        Osmosis: {
          id: "Osmosis",
          title: "Osmosis Dex",
          description: "Advanced automated market maker (AMM)",
          icon: osmosisSVG,
          defaultIsChecked: false,
          groupKey: "top-apps", // to reduce duplicates
        },
        astroport: {
          id: "astroport",
          title: "Astroport",
          description: "Powerful DEX",
          icon: astroportLogo,
          defaultIsChecked: false,
          groupKey: "top-apps", // to reduce duplicates
        },
        pulsar: {
          id: "pulsar",
          title: "Pulsar",
          description: "All-in-one dashboard",
          icon: pulsarLogo,
          defaultIsChecked: false,
          groupKey: "top-apps", // to reduce duplicates
        },
      },
    },
    "coming-soon": {
      id: "coming-soon",
      groupName: "Coming soon dApps",
      icon: otherAppsIcon,
      options: {
        toripunks: {
          id: "toripunks",
          title: "Toripunks dApp",
          description: "Coming soon",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        daodao: {
          id: "daodao",
          title: "DAODAO.zone",
          description: "DAOs for everyone",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        subdao: {
          id: "subdao",
          title: "Subdao Network",
          description: "Multi-functional DAO platform",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        artemis: {
          id: "artemis",
          title: "Artemis Vision",
          description: "NFT Revolution",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        uniswap: {
          id: "uniswap",
          title: "Uniswap DEX",
          description: "Trade crypto & NFTs",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        raydium: {
          id: "raydium",
          title: "Raydium DEX",
          description: "Trade crypto",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        SFoxyRaffle: {
          id: "SFoxyRaffle",
          title: "$FOXY Raffle",
          description: "Famous FOX NFT Raffles",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
        theGraph: {
          id: "theGraph",
          title: "The Graph",
          description: "WEB3 Protocol",
          icon: logoSimple,
          defaultIsChecked: false,
          groupKey: "coming-soon",
        },
      },
    },
  };
}

export function getSelectedApps(): string[] {
  return window.localStorage.getItem("teritori-dappstore")
    ? Array.from(
        JSON.parse(window.localStorage.getItem("teritori-dappstore") as string)
      )
    : [];
}

export function getValuesFromId(option: string) {
  const separator = "*SEPARATOR*";
  const separatorLen = separator.length;
  const offset = option.indexOf(separator);
  const appId = option.substring(offset + separatorLen);
  const groupKey = option.substring(0, offset);
  return { appId, groupKey };
}
