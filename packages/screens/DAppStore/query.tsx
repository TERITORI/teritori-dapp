import { dAppGroup } from "./types";

export function getAvailableApps(): dAppGroup {
  return window.localStorage.getItem("teritori-dappstore")
    ? JSON.parse(window.localStorage.getItem("teritori-dappstore") as string)
    : {
        "teritori-core-apps": {
          id: "teritori-core-apps",
          groupName: "Teritori Core dApps",
          icon: "",
          options: {
            "dApp 1": {
              id: "dApp 1",
              title: "dApp 1",
              description: "Short desc",
              icon: "",
              isChecked: true,
              order: 2,
              groupKey: "teritori-core-apps",
            },
            "dApp 2": {
              id: "dApp 2",
              title: "dApp 2",
              description:
                "Longer Longer Longer Longer Longer Longer Longer Longer",
              icon: "",
              isChecked: true,
              order: 1,
              groupKey: "teritori-core-apps",
            },
          },
        },
        "top-apps": {
          id: "top-apps",
          groupName: "Top Apps",
          icon: "",
          options: {
            "dApp 3": {
              id: "dApp 3",
              title: "dApp 3",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
            "dApp 4": {
              id: "dApp 4",
              title: "dApp 4",
              description:
                "Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
            "dApp 5": {
              id: "dApp 5",
              title: "dApp 5",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
            "dApp 6": {
              id: "dApp 6",
              title: "dApp 6",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
          },
        },
        "external-id": {
          id: "external-id",
          groupName: "External & Permissionless dApps",
          icon: "",
          options: {
            dApp1: {
              id: "dApp1",
              title: "External dApp 1",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "external-id",
            },
            dApp3: {
              id: "dApp3",
              title: "External dApp 3",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "external-id",
            },
          },
        },
      };
}
