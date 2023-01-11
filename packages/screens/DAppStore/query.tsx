import checklogo from "../../../assets/icons/checklogo.svg";
import placeHolder from "../../../assets/icons/info.svg";
import atomSVG from "../../../assets/icons/networks/cosmos-hub.svg";
import osmosisSVG from "../../../assets/icons/networks/osmosis.svg";
import teritoriSVG from "../../../assets/icons/networks/teritori.svg";
import { dAppGroup } from "./types";

export function getAvailableApps(): dAppGroup {
  return {
    "teritori-core-apps": {
      id: "teritori-core-apps",
      groupName: "Teritori Core dApps",
      icon: teritoriSVG,
      options: {
        "dApp 1": {
          id: "dApp 1",
          title: "dApp 1",
          description: "Short desc",
          icon: atomSVG,
          defaultIsChecked: false,
          groupKey: "teritori-core-apps",
        },
        "dApp 2": {
          id: "dApp 2",
          title: "dApp 2",
          description:
            "Longer Longer Longer Longer Longer Longer Longer Longer",
          icon: atomSVG,
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
          description: "Short desc",
          icon: osmosisSVG,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        "dApp 4": {
          id: "dApp 4",
          title: "dApp 4",
          description:
            "Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer",
          icon: atomSVG,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        "dApp 5": {
          id: "dApp 5",
          title: "dApp 5",
          description: "Short desc",
          icon: atomSVG,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
        "dApp 6": {
          id: "dApp 6",
          title: "dApp 6",
          description: "Short desc",
          icon: atomSVG,
          defaultIsChecked: false,
          groupKey: "top-apps",
        },
      },
    },
    "external-id": {
      id: "external-id",
      groupName: "External & Permissionless dApps",
      icon: placeHolder,
      options: {
        dApp1: {
          id: "dApp1",
          title: "External dApp 1",
          description: "Short desc",
          icon: atomSVG,
          defaultIsChecked: false,
          groupKey: "external-id",
        },
        dApp3: {
          id: "dApp3",
          title: "External dApp 3",
          description: "Short desc",
          icon: atomSVG,
          defaultIsChecked: false,
          groupKey: "external-id",
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
