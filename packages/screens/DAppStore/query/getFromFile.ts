import BookMarkIcon from "../../../../assets/icons/bookmark.svg";
import dao from "../../../../assets/icons/dao.svg";
import socialFeed from "../../../../assets/icons/feed.svg";
import freelance from "../../../../assets/icons/freelanceservice.svg";
import governance from "../../../../assets/icons/governance.svg";
import checklogo from "../../../../assets/icons/greenCheck.svg";
import launchpad from "../../../../assets/icons/launchpad.svg";
import leap from "../../../../assets/icons/leap-cosmos-logo.svg";
import marketplace from "../../../../assets/icons/marketplace.svg";
import messages from "../../../../assets/icons/messages.svg";
import multisig from "../../../../assets/icons/multisig.svg";
import osmosisSVG from "../../../../assets/icons/networks/osmosis.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import pathwar from "../../../../assets/icons/pathwar.svg";
import otherAppsIcon from "../../../../assets/icons/random-goods-icon.svg";
import riot from "../../../../assets/icons/rioters-game.svg";
import staking from "../../../../assets/icons/staking.svg";
import tnsService from "../../../../assets/icons/tns-service.svg";
import wallet from "../../../../assets/icons/wallet.svg";
import axelarLogo from "../../../../assets/logos/Axelar-logo.svg";
import mapOfZones from "../../../../assets/logos/MoZ-icon.svg";
import astroportLogo from "../../../../assets/logos/astroport.svg";
import coinHallLogo from "../../../../assets/logos/coinhall.svg";
import daodao from "../../../../assets/logos/daodao.png";
import kjnodes from "../../../../assets/logos/kjnodes-logo.svg";
import pulsarLogo from "../../../../assets/logos/pulsar-logo.svg";
import radyium from "../../../../assets/logos/raydium.png";
import skip from "../../../../assets/logos/skip.png";
import subdao from "../../../../assets/logos/subdao.png";
import tfm from "../../../../assets/logos/tfm-logo.png";
import theGraph from "../../../../assets/logos/theGraph.png";
import toripunks from "../../../../assets/logos/toniPunks.png";
import uniswap from "../../../../assets/logos/uniswap.png";
import { isElectron } from "../../../utils/isElectron";
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
          icon: dao,
          route: "Organizations",
          groupKey: "teritori-core-apps",
          selectedByDefault: false,
          alwaysOn: false,
        },
        "multisig-wallet": {
          id: "multisig-wallet",
          title: "Multisigs",
          description: "Secure your assets",
          icon: multisig,
          route: "Multisig",
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
          selectedByDefault: true,
          alwaysOn: false,
        },
      },
    },
    bookmarks: {
      id: "bookmarks",
      groupName: "External Apps",
      icon: BookMarkIcon,
      active: true,
      options: {
        pulsar: {
          id: "pulsar",
          title: "Pulsar",
          description: "All-in-one dashboard",
          icon: pulsarLogo,
          route: "External",
          url: "https://app.pulsar.finance/portfolio",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        axelar: {
          id: "axelar",
          title: "Axelar Satellite",
          description: "Cross blockchain bridge",
          icon: axelarLogo,

          route: "External",
          url: "https://satellite.money/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        tfm: {
          id: "tfm",
          title: "TFM",
          description: "DEX/NFT aggregation across Cosmos",
          icon: tfm,
          route: "External",
          url: "https://tfm.com/osmosis/trade/protrade?from=uosmo&to=ibc%2FEB7FB9C8B425F289B63703413327C2051030E848CE4EAAEA2E51199D6D39D3EC&market=Osmosis",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        mapofzones: {
          id: "mapofzones",
          title: "Map Of Zones",
          description: "Cosmos network explorer",
          icon: mapOfZones,
          route: "External",
          url: "https://mapofzones.com/zones/teritori-1/overview",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        slashboard: {
          id: "slashboard",
          title: "KJnodes: Slashboard",
          description: "Find the perfect validator",
          icon: kjnodes,
          route: "External",
          url: "https://services.kjnodes.com/mainnet/teritori/slashboard/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        coinhall: {
          id: "coinhall",
          title: "Coinhall",
          description: "Real-time price charts",
          icon: coinHallLogo,

          route: "External",
          url: "https://coinhall.org/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        leap: {
          id: "leap",
          title: "Leap Dashboard",
          description: "Leap Wallet Dashboard",
          icon: leap,

          route: "External",
          url: "https://cosmos.leapwallet.io/portfolio/overview",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        daodao: {
          id: "daodao",
          title: "DAODAO.zone",
          description: "DAOs for everyone",
          icon: daodao,

          route: "External",
          url: "https://daodao.zone/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        subdao: {
          id: "subdao",
          title: "Subdao Network",
          description: "Multi-functional DAO platform",
          icon: subdao,

          route: "External",
          url: "https://www.subdao.network/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        astroport: {
          id: "astroport",
          title: "Astroport",
          description: "Powerful DEX",
          icon: astroportLogo,

          route: "External",
          url: "https://app.astroport.fi/swap",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        uniswap: {
          id: "uniswap",
          title: "Uniswap DEX",
          description: "Trade crypto & NFTs",
          icon: uniswap,

          route: "External",
          url: "https://app.uniswap.org/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        raydium: {
          id: "raydium",
          title: "Raydium DEX",
          description: "Trade crypto",
          icon: radyium,

          route: "External",
          url: "https://raydium.io/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        skip: {
          id: "skip",
          title: "SKIP",
          description: "Interchain transfers and swaps on any Cosmos chain",
          icon: skip,

          route: "External",
          url: "https://ibc.fun/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
        theGraph: {
          id: "theGraph",
          title: "The Graph",
          description: "WEB3 Protocol",
          icon: theGraph,

          route: "External",
          url: "https://thegraph.com/",
          groupKey: "bookmarks",
          selectedByDefault: false,
          alwaysOn: false,
        },
      },
    },
    "coming-soon": {
      id: "coming-soon",
      groupName: "Coming soon dApps",
      icon: otherAppsIcon,
      active: true,
      options: {
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
        ...(isElectron()
          ? {
              messages: {
                id: "messages",
                title: "Messages",
                description: "Messages",
                icon: messages,
                route: "Message",
                groupKey: "coming-soon",
                selectedByDefault: false,
                alwaysOn: false,
              },
            }
          : {}),
      },
    },
  };
}
