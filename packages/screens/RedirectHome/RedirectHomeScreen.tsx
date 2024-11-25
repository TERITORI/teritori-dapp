import { useEffect } from "react";
import { ScreenContainer } from "react-native-screens";

import { useAppConfig } from "@/context/AppConfigProvider";
import { ScreenFC } from "@/utils/navigation";

export const RedirectHome: ScreenFC<"RedirectHome"> = ({ navigation }) => {
  const { homeScreen } = useAppConfig();
  useEffect(() => {
    navigation.navigate(homeScreen as any);
  }, [homeScreen, navigation]);
  return <ScreenContainer />;
};
