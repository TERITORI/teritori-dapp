import { dAppGroup } from "./types";

export function getAvailableApps(): dAppGroup {
  return {
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
        },
        "dApp 3": {
          id: "dApp 3",
          title: "dApp 3",
          description:
            "Longer Longer Longer Longer Longer Longer Longer Longer",
          icon: "",
          isChecked: true,
          order: 1,
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
        },
        dApp12: {
          id: "dApp12",
          title: "dApp 1",
          description:
            "Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer",
          icon: "",
          isChecked: false,
          order: -1,
        },
        dApp123: {
          id: "dApp123",
          title: "dApp 1",
          description: "Short desc",
          icon: "",
          isChecked: false,
          order: -1,
        },
        "dApp 3": {
          id: "dApp 3",
          title: "dApp 3",
          description: "Short desc",
          icon: "",
          isChecked: false,
          order: -1,
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
        },
        dApp3: {
          id: "dApp3",
          title: "dApp 3",
          description: "Short desc",
          icon: "",
          isChecked: false,
          order: -1,
        },
      },
    },
  };
}
