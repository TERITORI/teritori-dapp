import { createContext, useContext, useEffect, useState } from "react";

import { fetchLaunchpadItems, LaunchpadItem } from "../utils/airtable";

interface LaunchpadContextValue {
  launchpadItems: LaunchpadItem[];
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
      const items = await fetchLaunchpadItems();
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
