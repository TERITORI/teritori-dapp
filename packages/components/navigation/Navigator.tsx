import { MiniModeNavigator } from "./MiniModeNavigator";
import { NormalModeNavigator } from "./NormalModeNavigator";

import { useAppMode } from "@/hooks/useAppMode";

export const Navigator = () => {
  const [appMode] = useAppMode();

  if (appMode === "mini") {
    return <MiniModeNavigator />;
  }
  return <NormalModeNavigator />;
};
