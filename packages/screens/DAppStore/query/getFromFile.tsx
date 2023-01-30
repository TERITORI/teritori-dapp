import checklogo from "../../../../assets/icons/greenCheck.svg";
import launchpad from "../../../../assets/icons/launchpad.svg";
import logoSimple from "../../../../assets/icons/logo-simple.svg";
import marketplace from "../../../../assets/icons/marketplace.svg";
import osmosisSVG from "../../../../assets/icons/networks/osmosis.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import otherAppsIcon from "../../../../assets/icons/random-goods-icon.svg";
import axelarLogo from "../../../../assets/logos/Axelar-logo.svg";
import artemisVision from "../../../../assets/logos/artemisVision.png";
import astroportLogo from "../../../../assets/logos/astroport.svg";
import coinHallLogo from "../../../../assets/logos/coinhall.svg";
import daodao from "../../../../assets/logos/daodao.png";
import falconWalletLogo from "../../../../assets/logos/falconWallet.svg";
import pulsarLogo from "../../../../assets/logos/pulsar-logo.svg";
import radyium from "../../../../assets/logos/raydium.png";
import foxyRaffle from "../../../../assets/logos/sfoxy.png";
import skip from "../../../../assets/logos/skip.png";
import subdao from "../../../../assets/logos/subdao.png";
import theGraph from "../../../../assets/logos/theGraph.png";
import toripunks from "../../../../assets/logos/toniPunks.png";
import uniswap from "../../../../assets/logos/uniswap.png";
import { dAppGroup } from "../types";
// import warningTriangle from "../../../assets/icons/warning-triangle-orange.svg";

export function getAvailableApps(): dAppGroup {
  return {
    "teritori-core-apps": {
      id: "teritori-core-apps",
      groupName: "Teritori Core dApps",
      icon: teritoriSVG,
      active: true,
      options: {
        "tori-marketplace": {
          id: "tori-marketplace",
          title: "Marketplace",
          description: "NFT Marketplace",
          icon: marketplace,
          route: "Marketplace",
          groupKey: "teritori-core-apps",
        },
        "tori-Launchpad": {
          id: "tori-Launchpad",
          title: "Launchpad",
          description: "Multi Network NFT Launcher",
          icon: launchpad,
          route: "Launchpad",
          groupKey: "teritori-core-apps",
        },
        OrgDeployer: {
          id: "OrgDeployer",
          title: "Org Deployer",
          description: "Coming soon!",
          icon: logoSimple,
          route: "ComingSoon",
          groupKey: "teritori-core-apps",
        },
      },
    },
    "top-apps": {
      id: "top-apps",
      groupName: "Top Apps",
      icon: checklogo,
      active: true,
      options: {
        Osmosis: {
          id: "Osmosis",
          title: "Osmosis Dex",
          description: "Advanced automated market maker (AMM)",
          icon: osmosisSVG,
          route: "ComingSoon",
          groupKey: "top-apps",
        },
      },
    },
    // "external-id": {
    //   id: "external-id",
    //   groupName: "External & Permissionless dApps",
    //   icon: warningTriangle,
    //   active: true,
    //   options: {
    //     Osmosis: {
    //       id: "Osmosis",
    //       title: "Osmosis Dex",
    //       description: "Advanced automated market maker (AMM)",
    //       icon: osmosisSVG,
    //       route: "ComingSoon",
    //       groupKey: "top-apps", // to reduce duplicates
    //     },
    //   },
    // },
    "coming-soon": {
      id: "coming-soon",
      groupName: "Coming soon dApps",
      icon: otherAppsIcon,
      active: true,
      options: {
        astroport: {
          id: "astroport",
          title: "Astroport",
          description: "Powerful DEX",
          icon: astroportLogo,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        pulsar: {
          id: "pulsar",
          title: "Pulsar",
          description: "All-in-one dashboard",
          icon: pulsarLogo,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        axelar: {
          id: "axelar",
          title: "Axelar Network",
          description: "Secure building",
          icon: axelarLogo,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        coinhall: {
          id: "coinhall",
          title: "Coinhall",
          description: "Real-time price charts",
          icon: coinHallLogo,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        falcon: {
          id: "falcon",
          title: "Falcon Wallet",
          description: "Secure interchain wallet",
          icon: falconWalletLogo,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        toripunks: {
          id: "toripunks",
          title: "Toripunks dApp",
          description: "Coming soon",
          icon: toripunks,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        daodao: {
          id: "daodao",
          title: "DAODAO.zone",
          description: "DAOs for everyone",
          icon: daodao,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        subdao: {
          id: "subdao",
          title: "Subdao Network",
          description: "Multi-functional DAO platform",
          icon: subdao,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        artemis: {
          id: "artemis",
          title: "Artemis Vision",
          description: "NFT Revolution",
          icon: artemisVision,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        uniswap: {
          id: "uniswap",
          title: "Uniswap DEX",
          description: "Trade crypto & NFTs",
          icon: uniswap,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        raydium: {
          id: "raydium",
          title: "Raydium DEX",
          description: "Trade crypto",
          icon: radyium,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        SFoxyRaffle: {
          id: "SFoxyRaffle",
          title: "$FOXY Raffle",
          description: "Famous FOX NFT Raffles",
          icon: foxyRaffle,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        skip: {
          id: "skip",
          title: "SKIP",
          description: "Building ecosystem",
          icon: skip,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
        theGraph: {
          id: "theGraph",
          title: "The Graph",
          description: "WEB3 Protocol",
          icon: theGraph,
          route: "ComingSoon",
          groupKey: "coming-soon",
        },
      },
    },
  };
}
