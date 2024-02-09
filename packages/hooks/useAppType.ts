import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

type AppType = "normal" | "mini" | "web3Addict";

export const useAppType = () => {
  const [appType, setAppType] = useState<AppType>(
    Platform.OS === "web" ? "normal" : "mini",
  );

  const handleSet = async (type: AppType) => {
    setAppType(type);
    await AsyncStorage.setItem("app-type", type);
  };

  useEffect(() => {
    const getAppType = async () => {
      const savedAppType = await AsyncStorage.getItem("app-type");
      if (
        savedAppType &&
        ["normal", "mini", "web3Addict"].includes(savedAppType)
      ) {
        setAppType(savedAppType as AppType);
      }
    };
    getAppType();
  }, []);

  return [appType, handleSet];
};
