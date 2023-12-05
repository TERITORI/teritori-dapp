import { useFonts } from "expo-font";

export const useToriPunksFonts = () => {
  return useFonts({
    "Bebas Neue": require("./Bebas_Neue/BebasNeue-Regular.ttf"),
    "Dafter Harder Better Stronger": require("./Dafter_Harder_Better_Stronger/Dafter Harder Better Stronger.ttf"),
  });
};
