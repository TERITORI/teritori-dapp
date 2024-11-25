import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import ToggleButton from "../../../components/buttons/ToggleButton";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { useAppMode } from "@/hooks/useAppMode";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium13 } from "@/utils/style/fonts";

export const PreferencesSettingScreen: ScreenFC<"MiniPreferencesSetting"> = ({
  navigation,
}) => {
  const [appMode, handleSet] = useAppMode();

  const navigateToSettings = () => navigation.replace("MiniSettings");

  return (
    <BlurScreenContainer title="Preferences" onGoBack={navigateToSettings}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View>
          <SpacerColumn size={3} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: layout.spacing_x1_5,
              }}
            >
              <BrandText>Mini Mode</BrandText>
            </View>

            <ToggleButton
              isActive={appMode === "mini"}
              onValueChange={() => {
                handleSet("web3Addict");
              }}
            />
          </View>
          <SpacerColumn size={1} />
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            Disabling this will run your app in web3Addict mode.
          </BrandText>
        </View>
      </View>
    </BlurScreenContainer>
  );
};
