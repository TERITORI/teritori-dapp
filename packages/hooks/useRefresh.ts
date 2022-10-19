import { useCallback, useState } from "react";

export const useRefresh = (): [() => void, number] => {
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);
  return [refresh, refreshIndex];
};
