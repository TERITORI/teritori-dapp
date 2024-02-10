import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

type AppMode = "normal" | "mini" | "web3Addict";

export const useAppMode = () => {
  const [appMode, setAppMode] = useState<AppMode>(
    Platform.OS === "web" ? "normal" : "mini",
  );

  const handleSet = async (type: AppMode) => {
    setAppMode(type);
    await AsyncStorage.setItem("app-mode", type);
  };

  useEffect(() => {
    const getAppMode = async () => {
      const savedAppMode = await AsyncStorage.getItem("app-mode");
      if (
        savedAppMode &&
        ["normal", "mini", "web3Addict"].includes(savedAppMode)
      ) {
        setAppMode(savedAppMode as AppMode);
      }
    };
    getAppMode();
  }, []);

  return [appMode, handleSet];
};
