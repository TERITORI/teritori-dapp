import socialFeed from "../../../../assets/icons/feed.svg";
import freelance from "../../../../assets/icons/freelanceservice.svg";
import governance from "../../../../assets/icons/governance.svg";
import checklogo from "../../../../assets/icons/greenCheck.svg";
import launchpad from "../../../../assets/icons/launchpad.svg";
import marketplace from "../../../../assets/icons/marketplace.svg";
import messages from "../../../../assets/icons/messages.svg";
import multisig from "../../../../assets/icons/multisig.svg";
import musicplayer from "../../../../assets/icons/musicplayer.svg";
import osmosisSVG from "../../../../assets/icons/networks/osmosis.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import pathwar from "../../../../assets/icons/pathwar.svg";
import otherAppsIcon from "../../../../assets/icons/random-goods-icon.svg";
import riot from "../../../../assets/icons/rioters-game.svg";
import staking from "../../../../assets/icons/staking.svg";
import tnsService from "../../../../assets/icons/tns-service.svg";
import wallet from "../../../../assets/icons/wallet.svg";
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

export function getAvailableApps(): dAppGroup {
  return {
    "teritori-core-apps": {
      id: "teritori-core-apps",
      groupName: "Teritori Core dApps",
      icon: teritoriSVG,
      active: true,
      options: {
        marketplace: {
          id: "marketplace",
          title: "Marketplace",
          description: "NFT Marketplace",
          icon: marketplace,
          route: "Marketplace",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: true,
        },
        launchpad: {
          id: "launchpad",
          title: "Launchpad",
          description: "Multi Network NFT Launcher",
          icon: launchpad,
          route: "Launchpad",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: true,
        },
        namespace: {
          id: "namespace",
          title: "Name Service",
          description: "Teritori Name Service",
          icon: tnsService,
          route: "TNSHome",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: true,
        },
        wallet: {
          id: "wallet",
          title: "My Wallet",
          description: "Wallet",
          icon: wallet,
          route: "WalletManager",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: true,
        },
        staking: {
          id: "staking",
          title: "Staking",
          description: "Staking",
          icon: staking,
          route: "Staking",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: false,
        },
        governance: {
          id: "governance",
          title: "Governance",
          description: "Governance",
          icon: governance,
          route: "Governance",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: false,
        },
        organizations: {
          id: "organizations",
          title: "Organizations",
          description: "Decentralized Autonomous Organizations",
          icon: multisig,
          route: "Organizations",
          groupKey: "teritori-core-apps",
          selectedByDefault: false,
          alwaysOn: false,
        },
        messages: {
          id: "messages",
          title: "Messages",
          description: "Messages",
          icon: messages,
          route: "Messages",
          groupKey: "teritori-core-apps",
          selectedByDefault: true,
          alwaysOn: false,
        },
      },
    },
    "top-apps": {
      id: "top-apps",
      groupName: "Top dApps",
      icon: checklogo,
      active: true,
      options: {
        osmosis: {
          id: "osmosis",
          title: "Osmosis Dex",
          description: "Advanced automated market maker (AMM)",
          icon: osmosisSVG,
          route: "Swap",
          groupKey: "top-apps",
          selectedByDefault: true,
          alwaysOn: false,
        },
        "social-feed": {
          id: "social-feed",
          title: "Social Feed",
          description: "Decentralized Social Feed",
          icon: socialFeed,
          route: "Feed",
          groupKey: "top-apps",
          selectedByDefault: true,
          alwaysOn: true,
        },
        riotersGame: {
          id: "riotersGame",
          title: "Join The R!ot",
          description: "Join The R!ot",
          icon: riot,
          route: "RiotGame",
          groupKey: "top-apps",
          selectedByDefault: true,
          alwaysOn: true,
        },
        toripunks: {
          id: "toripunks",
          title: "Toripunks dApp",
          icon: toripunks,
          description: "Enter the Bar, play games. punks!",
          route: "ToriPunks",
          groupKey: "top-apps",
          selectedByDefault: false,
          alwaysOn: false,
        },
        messages: {
          id: "messages",
          title: "Messages",
          description: "Messages",
          icon: messages,
          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: true,
          alwaysOn: true,
        },
      },
    },
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
          selectedByDefault: false,
          alwaysOn: false,
        },
        pulsar: {
          id: "pulsar",
          title: "Pulsar",
          description: "All-in-one dashboard",
          icon: pulsarLogo,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        axelar: {
          id: "axelar",
          title: "Axelar Network",
          description: "Secure building",
          icon: axelarLogo,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        coinhall: {
          id: "coinhall",
          title: "Coinhall",
          description: "Real-time price charts",
          icon: coinHallLogo,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        falcon: {
          id: "falcon",
          title: "Falcon Wallet",
          description: "Secure interchain wallet",
          icon: falconWalletLogo,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        daodao: {
          id: "daodao",
          title: "DAODAO.zone",
          description: "DAOs for everyone",
          icon: daodao,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        subdao: {
          id: "subdao",
          title: "Subdao Network",
          description: "Multi-functional DAO platform",
          icon: subdao,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        artemis: {
          id: "artemis",
          title: "Artemis Vision",
          description: "NFT Revolution",
          icon: artemisVision,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        uniswap: {
          id: "uniswap",
          title: "Uniswap DEX",
          description: "Trade crypto & NFTs",
          icon: uniswap,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        raydium: {
          id: "raydium",
          title: "Raydium DEX",
          description: "Trade crypto",
          icon: radyium,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        SFoxyRaffle: {
          id: "SFoxyRaffle",
          title: "$FOXY Raffle",
          description: "Famous FOX NFT Raffles",
          icon: foxyRaffle,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        skip: {
          id: "skip",
          title: "SKIP",
          description: "Building ecosystem",
          icon: skip,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        theGraph: {
          id: "theGraph",
          title: "The Graph",
          description: "WEB3 Protocol",
          icon: theGraph,

          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        pathwar: {
          id: "pathwar",
          title: "Pathwar",
          description: "Hone your security skills ",
          icon: pathwar,
          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        "freelance-service": {
          id: "freelance-service",
          title: "Freelance Service",
          description: "Find the perfect match for your project",
          icon: freelance,
          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        "multisig-wallet": {
          id: "multisig-wallet",
          title: "Multisig Wallet",
          description: "Secure your assets",
          icon: multisig,
          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
        "music-player": {
          id: "music-player",
          title: "Music Player",
          description: "Play your favorite music",
          icon: musicplayer,
          route: "ComingSoon",
          groupKey: "coming-soon",
          selectedByDefault: false,
          alwaysOn: false,
        },
      },
    },
  };
}
