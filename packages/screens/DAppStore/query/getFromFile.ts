import { Platform } from "react-native";

import BookMarkIcon from "@/assets/icons/bookmark.svg";
import dao from "@/assets/icons/dao.svg";
import socialFeed from "@/assets/icons/feed.svg";
import freelance from "@/assets/icons/freelanceservice.svg";
import governance from "@/assets/icons/governance.svg";
import checklogo from "@/assets/icons/greenCheck.svg";
import {
  default as launchpad,
  default as launchpadSVG,
} from "@/assets/icons/launchpad.svg";
import leap from "@/assets/icons/leap-cosmos-logo.svg";
import marketplace from "@/assets/icons/marketplace.svg";
import messages from "@/assets/icons/messages.svg";
import multisig from "@/assets/icons/multisig.svg";
import osmosisSVG from "@/assets/icons/networks/osmosis.svg";
import teritoriSVG from "@/assets/icons/networks/teritori.svg";
import pathwar from "@/assets/icons/pathwar.svg";
import projectsProgramSVG from "@/assets/icons/projects-program.svg";
import rakki from "@/assets/icons/rakki-ticket.svg";
import otherAppsIcon from "@/assets/icons/random-goods-icon.svg";
import riot from "@/assets/icons/rioters-game.svg";
import staking from "@/assets/icons/staking.svg";
import tnsService from "@/assets/icons/tns-service.svg";
import wallet from "@/assets/icons/wallet.svg";
import axelarLogo from "@/assets/logos/Axelar-logo.svg";
import mapOfZones from "@/assets/logos/MoZ-icon.svg";
import astroportLogo from "@/assets/logos/astroport.svg";
import calcfinance from "@/assets/logos/calc-finance.jpg";
import coinHallLogo from "@/assets/logos/coinhall.svg";
import mintscanLogo from "@/assets/logos/cosmostation-val.png";
import daodao from "@/assets/logos/daodao.png";
import kjnodes from "@/assets/logos/kjnodes-logo.svg";
import kujirapod from "@/assets/logos/kujira-network.svg";
import nodesguruLogo from "@/assets/logos/nodeguru-val.svg";
import pingpubLogo from "@/assets/logos/pingpub-val.svg";
import pulsarLogo from "@/assets/logos/pulsar-logo.svg";
import radyium from "@/assets/logos/raydium.png";
import restake from "@/assets/logos/restake.png";
import skip from "@/assets/logos/skip.png";
import stakemeLogo from "@/assets/logos/stakeme-val.svg";
import subdao from "@/assets/logos/subdao.png";
import tfm from "@/assets/logos/tfm-logo.png";
import theGraph from "@/assets/logos/theGraph.png";
import toripunks from "@/assets/logos/toniPunks.png";
import uniswap from "@/assets/logos/uniswap.png";
import { isElectron } from "@/utils/isElectron";
import { dAppGroup } from "@/utils/types/dapp-store";

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
        ...(Platform.OS !== "web"
          ? {
              toriwallet: {
                id: "toriwallet",
                title: "Teritori OS Wallet",
                description: "Wallet",
                icon: wallet,
                route: "NativeWallet",
                groupKey: "teritori-core-apps",
                selectedByDefault: true,
                alwaysOn: false,
              },
            }
          : {
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
            }),
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
        ...(isElectron() || ["android", "ios"].includes(Platform.OS)
          ? {
              messages: {
                id: "messages",
                title: "Messages",
                description: "Messages",
                icon: messages,
                route: "Message",
                groupKey: "teritori-core-apps",
                selectedByDefault: true,
                alwaysOn: false,
              },
            }
          : {}),
      },
    },
    "top-apps": {
      id: "top-apps",
      groupName: "Top dApps",
      icon: checklogo,
      active: true,
      options: {
        ...(Platform.OS !== "web"
          ? {
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
            }
          : {}),
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
        projects: {
          id: "projects",
          title: "Projects Program",
          icon: projectsProgramSVG,
          description: "Projects Program",
          route: "Projects",
          groupKey: "top-apps",
          selectedByDefault: false,
          alwaysOn: false,
          devOnly: true,
        },
        launchpaderc20: {
          id: "launchpad-erc20",
          title: "Launchpad ERC20",
          icon: launchpadSVG,
          description: "Create your own ERC20 token",
          route: "LaunchpadERC20",
          groupKey: "top-apps",
          selectedByDefault: false,
          alwaysOn: false,
          devOnly: true,
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
        calc: {
          id: "calc",
          title: "Calc Finance",
          icon: calcfinance,
          description: "DCA into your favorite assets",
          route: "External",
          url: "https://app.calculated.fi/?chain=osmosis-1",
          groupKey: "top-apps",
          selectedByDefault: true,
          alwaysOn: false,
        },
        rakki: {
          id: "rakki",
          icon: rakki,
          title: "RAKKi",
          description: "Automated lottery",
          route: "Rakki",
          groupKey: "top-apps",
          selectedByDefault: true,
          alwaysOn: false,
        },
      },
    },
    explorers: {
      id: "explorers",
      groupName: "Explorers",
      icon: BookMarkIcon,
      active: true,
      options: {
        exploreme: {
          id: "exploreme",
          title: "ExploreMe",
          description: "by STAKEME",
          icon: stakemeLogo,
          route: "External",
          url: "https://teritori.exploreme.pro/dashboard/",
          groupKey: "explorers",
          selectedByDefault: false,
          alwaysOn: false,
        },
        guru: {
          id: "guru",
          title: "Explorers Guru",
          description: "by Nodes.Guru",
          icon: nodesguruLogo,
          route: "External",
          url: "https://teritori.explorers.guru/validators",
          groupKey: "explorers",
          selectedByDefault: false,
          alwaysOn: false,
        },
        "teritori-explorer": {
          id: "teritori-explorer",
          title: "Teritori Explorer",
          description: "by Ping.pub + Core Team",
          icon: pingpubLogo,
          route: "External",
          url: "https://explorer.teritori.com/teritori",
          groupKey: "explorers",
          selectedByDefault: false,
          alwaysOn: false,
        },
        mintscan: {
          id: "mintscan",
          title: "Mintscan",
          description: "Cosmostation: Mintscan",
          icon: mintscanLogo,
          route: "External",
          url: "https://www.mintscan.io/teritori/ecosystem",
          groupKey: "explorers",
          selectedByDefault: false,
          alwaysOn: false,
        },
      },
    },
    staking: {
      id: "staking",
      groupName: "Staking",
      icon: BookMarkIcon,
      active: true,
      options: {
        restake: {
          id: "restake",
          title: "Restake",
          description: "Auto compound your rewards",
          icon: restake,
          route: "External",
          url: "https://restake.app/teritori",
          groupKey: "staking",
          selectedByDefault: false,
          alwaysOn: false,
        },
        kujirapod: {
          id: "kujirapod",
          title: "Kujira: Pod",
          description: "Balance your stake across multiple validators",
          icon: kujirapod,
          route: "External",
          url: "https://pod.kujira.app/teritori-1",
          groupKey: "staking",
          selectedByDefault: false,
          alwaysOn: false,
        },
        "teritori-staking": {
          id: "teritori-staking",
          title: "Staking",
          description: "by Teritori Team",
          icon: staking,
          route: "Staking",
          groupKey: "staking",
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
