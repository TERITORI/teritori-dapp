import { useSelector } from "react-redux";

import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import {
  selectAreTestnetsEnabled,
  setAreTestnetsEnabled,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ScreenFC } from "../../utils/navigation";

export const SettingsScreen: ScreenFC<"Settings"> = () => {
  const testnetsEnabled = useSelector(selectAreTestnetsEnabled);
  const dispatch = useAppDispatch();
  return (
    <ScreenContainer>
      <PrimaryButton
        size="M"
        text={testnetsEnabled ? "Disable testnets" : "Enable testnets"}
        onPress={() => {
          dispatch(setAreTestnetsEnabled(!testnetsEnabled));
        }}
      />
    </ScreenContainer>
  );
};
