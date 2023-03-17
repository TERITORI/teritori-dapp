import dappStoreSVG from "../../assets/icons/dapp-store.svg";
import rioterFooterSVG from "../../assets/icons/footer-rioters.svg";
import governanceSVG from "../../assets/icons/governance.svg";
import gridSVG from "../../assets/icons/grid.svg";
import launchpadApplySVG from "../../assets/icons/launchpad-apply.svg";
import launchpadLaunchpadSVG from "../../assets/icons/launchpad-launchpad.svg";
import launchpadSVG from "../../assets/icons/launchpad.svg";
import messagesSVG from "../../assets/icons/messages.svg";
import riotersGameSVG from "../../assets/icons/rioters-game.svg";
import stakingSVG from "../../assets/icons/staking.svg";
import tnsServiceSVG from "../../assets/icons/tns-service.svg";
import walletRegSVG from "../../assets/icons/wallet-regular.svg";
import walletSVG from "../../assets/icons/wallet-sidebar.svg";
import { SidebarRecordType } from "../components/navigation/types";
import { NetworkKind } from "../networks";

export const SIDEBAR_LIST: SidebarRecordType = {
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
  governance: {
    title: "Governance",
    id: "Governance",
    route: "Governance",
    icon: governanceSVG,
    disabledOn: [NetworkKind.Ethereum],
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
};
