import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { safeParseJSON } from "@/utils/sanitize";

export function useOnboardedStatus(): [
  isLoading: boolean,
  isOnboarded: boolean,
] {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOnboardedStatus();
  }, []);
  const getOnboardedStatus = async () => {
    const onboarded = await AsyncStorage.getItem("ONBOARDED");
    const isOnboardedStat = safeParseJSON(onboarded as string) as boolean;

    setIsOnboarded(isOnboardedStat);
    setIsLoading(false);
  };
  return [isLoading, isOnboarded];
}
