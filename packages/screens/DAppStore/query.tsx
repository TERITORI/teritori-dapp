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
            "dApp 3": {
              id: "dApp 3",
              title: "dApp 3",
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
            dApp1: {
              id: "dApp1",
              title: "dApp 1",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
            dApp12: {
              id: "dApp12",
              title: "dApp 1",
              description:
                "Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
            dApp123: {
              id: "dApp123",
              title: "dApp 1",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "top-apps",
            },
            "dApp 3": {
              id: "dApp 3",
              title: "dApp 3",
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
              title: "dApp 1",
              description: "Short desc",
              icon: "",
              isChecked: false,
              order: -1,
              groupKey: "external-id",
            },
            dApp3: {
              id: "dApp3",
              title: "dApp 3",
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
