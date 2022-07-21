import { createContext, useContext, useEffect, useState } from "react";

import { Collection } from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";

interface LaunchpadContextValue {
  launchpadItems: Collection[];
}

const initialValue: LaunchpadContextValue = {
  launchpadItems: [],
};

const launchpadContext = createContext(initialValue);

export const LaunchpadProvider = ({ children }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const effect = async () => {
      console.log("refreshing launchpad items");
      const launches = backendClient.UpcomingLaunches({});
      const items: Collection[] = [];
      await launches.forEach((launch) => {
        items.push(launch.collection);
      });
      setValue({ launchpadItems: items });
    };
    effect();
  }, []);

  return (
    <launchpadContext.Provider value={value}>
      {children}
    </launchpadContext.Provider>
  );
};

export const useLaunchpadData = () => useContext(launchpadContext);
