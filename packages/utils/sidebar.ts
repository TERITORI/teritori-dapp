import dappStoreSVG from "../../assets/icons/dapp-store.svg";
import feedSVG from "../../assets/icons/feed.svg";
import rioterFooterSVG from "../../assets/icons/footer-rioters.svg";
import governanceSVG from "../../assets/icons/governance.svg";
import gridSVG from "../../assets/icons/grid.svg";
import launchpadApplySVG from "../../assets/icons/launchpad-apply.svg";
import launchpadLaunchpadSVG from "../../assets/icons/launchpad-launchpad.svg";
import launchpadSVG from "../../assets/icons/launchpad.svg";
import messagesSVG from "../../assets/icons/messages.svg";
import multisigSVG from "../../assets/icons/multisig.svg";
import osmosisCircleSVG from "../../assets/icons/networks/osmosis-circle.svg";
import pathwarSVG from "../../assets/icons/pathwar.svg";
import riotersGameSVG from "../../assets/icons/rioters-game.svg";
import stakingSVG from "../../assets/icons/staking.svg";
import tnsServiceSVG from "../../assets/icons/tns-service.svg";
import walletRegSVG from "../../assets/icons/wallet-regular.svg";
import walletSVG from "../../assets/icons/wallet-sidebar.svg";
import { SidebarRecordType } from "../components/navigation/types";
import { NetworkKind } from "../networks";

export const SIDEBAR_LIST: SidebarRecordType = {
  feed: {
    title: "Social Feed",
    route: "Feed",
    id: "Feed",
    icon: feedSVG,
  },
  messages: {
    title: "Messages",
    id: "Messages",
    route: "ComingSoon",
    icon: messagesSVG,
  },
  launchpad: {
    title: "Launchpad",
    id: "Launchpad",
    route: "Launchpad",
    icon: launchpadSVG,
    nested: {
      launchpad: {
        title: "Launchpad",
        id: "nested-Launchpad",
        icon: launchpadLaunchpadSVG,
        route: "Launchpad",
      },
      apply: {
        title: "Apply",
        id: "Apply",
        icon: launchpadApplySVG,
        route: "LaunchpadApply",
      },
    },
  },
  namespace: {
    title: "Name Service",
    id: "Name Service",
    route: "TNSHome",
    icon: tnsServiceSVG,
    disabledOn: [NetworkKind.Ethereum],
  },
  wallet: {
    title: "My Wallet",
    id: "My Wallet",
    route: "WalletManager",
    icon: walletSVG,
    nested: {
      dashboard: {
        title: "My Dashboard",
        id: "My Dashboard",
        icon: gridSVG,
        route: "WalletManager",
      },
      wallets: {
        title: "Wallets",
        id: "Wallets",
        icon: walletRegSVG,
        route: "WalletManagerWallets",
      },
    },
  },
  staking: {
    title: "Staking",
    id: "Staking",
    route: "Staking",
    icon: stakingSVG,
    disabledOn: [NetworkKind.Ethereum],
  },
  organizations: {
    title: "Organizations",
    id: "Organizations",
    route: "Organizations",
    icon: multisigSVG,
  },
  governance: {
    title: "Governance",
    id: "Governance",
    route: "Governance",
    icon: governanceSVG,
    disabledOn: [NetworkKind.Ethereum],
  },
  swap: {
    title: "Swap Osmosis",
    id: "Swap",
    route: "Swap",
    icon: osmosisCircleSVG,
  },
  pathwar: {
    title: "Pathwar",
    id: "Pathwar",
    route: "ComingSoon",
    icon: pathwarSVG,
  },
  riotersGame: {
    title: "Join The R!ot",
    id: "Join The R!ot",
    route: "RiotGame",
    icon: riotersGameSVG,
    disabledOn: [NetworkKind.Ethereum],
  },
  riotersFooter: {
    title: "Rioters Footer",
    id: "Rioters Footer",
    route: "ComingSoon",
    icon: rioterFooterSVG,
  },
  DAppsStore: {
    title: "dApp Store",
    id: "dApp Store",
    route: "DAppStore",
    icon: dappStoreSVG,
  },
  videoplayer: {
    title: "Video",
    id: "Video",
    route: "VideoPlayer",
    icon: dappStoreSVG,
  },
};
