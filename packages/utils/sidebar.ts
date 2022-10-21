import feedSVG from "../../assets/icons/feed.svg";
import rioterFooterSVG from "../../assets/icons/footer-rioters.svg";
import governanceSVG from "../../assets/icons/governance.svg";
import launchpadSVG from "../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../assets/icons/marketplace.svg";
import messagesSVG from "../../assets/icons/messages.svg";
import pathwarSVG from "../../assets/icons/pathwar.svg";
import riotersGameSVG from "../../assets/icons/rioters-game.svg";
import stakingSVG from "../../assets/icons/staking.svg";
import tnsServiceSVG from "../../assets/icons/tns-service.svg";
import walletSVG from "../../assets/icons/wallet-sidebar.svg";
import { SidebarType } from "../components/navigation/types";

export const SIDEBAR_LIST: SidebarType = {
  feed: {
    title: "Feed",
    route: "ComingSoon",
    icon: feedSVG,
  },
  messages: {
    title: "Messages",
    route: "ComingSoon",
    icon: messagesSVG,
  },
  wallet: {
    title: "My Wallet",
    route: "WalletManager",
    icon: walletSVG,
  },
  staking: {
    title: "Staking",
    route: "Staking",
    icon: stakingSVG,
  },
  governance: {
    title: "Governance",
    route: "Governance",
    icon: governanceSVG,
  },
  marketplace: {
    title: "Marketplace",
    route: "Marketplace",
    icon: marketplaceSVG,
  },
  launchpad: {
    title: "Launchpad",
    route: "Launchpad",
    icon: launchpadSVG,
  },
  namespace: {
    title: "Name Service",
    route: "ComingSoon",
    icon: tnsServiceSVG,
  },
  riotersGame: {
    title: "Rioters Game",
    route: "GuardiansGame",
    icon: riotersGameSVG,
  },
  pathwar: {
    title: "Pathwar",
    route: "ComingSoon",
    icon: pathwarSVG,
  },
  riotersFooter: {
    title: "Rioters Footer",
    route: "RiotersFooter",
    icon: rioterFooterSVG,
  },
};
