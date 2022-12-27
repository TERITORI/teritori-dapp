import { dAppGroup } from "./types";

export function getAvailableApps(): dAppGroup {
  const availableApps: dAppGroup = {
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
        },
        "dApp 3": {
          id: "dApp 3",
          title: "dApp 3",
          description:
            "Longer Longer Longer Longer Longer Longer Longer Longer",
          icon: "",
          isChecked: false,
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
        },
        dApp12: {
          id: "dApp12",
          title: "dApp 1",
          description:
            "Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer Longer",
          icon: "",
          isChecked: false,
        },
        dApp123: {
          id: "dApp123",
          title: "dApp 1",
          description: "Short desc",
          icon: "",
          isChecked: false,
        },
        "dApp 3": {
          id: "dApp 3",
          title: "dApp 3",
          description: "Short desc",
          icon: "",
          isChecked: false,
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
        },
        dApp3: {
          id: "dApp3",
          title: "dApp 3",
          description: "Short desc",
          icon: "",
          isChecked: false,
        },
      },
    },
  };
  return availableApps;
}
