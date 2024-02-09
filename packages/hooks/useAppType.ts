import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type AppType = "normal" | "mini" | "web3Addict";

export const useAppType = () => {
  const [appType, setAppType] = useState<AppType>("mini");

  const handleSet = async (type: AppType) => {
    setAppType(type);
    await AsyncStorage.setItem("app-type", type);
  };

  useEffect(() => {
    const getAppType = async () => {
      const savedAppType = await AsyncStorage.getItem("app-type");
      if (savedAppType && ["web3Addict", "mini"].includes(savedAppType)) {
        setAppType("mini");
      }
    };
    getAppType();
  }, []);

  return [appType, handleSet];
};
