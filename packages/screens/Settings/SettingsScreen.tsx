import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
import {SettingsView} from "./components/SettingsView";
export const SettingsScreen: ScreenFC<"Settings"> = () => {
  return (
    <ScreenContainer noMargin fullWidth>
      <SettingsView />
    </ScreenContainer>
  );
};
