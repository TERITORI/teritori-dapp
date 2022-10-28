import React, { useState } from "react";
import { View } from "react-native";

import exploreSVG from "../../../assets/icons/explore.svg";
import manageSVG from "../../../assets/icons/manage.svg";
import registerSVG from "../../../assets/icons/register.svg";
import { IntroLogoText } from "../../components/IntroLogoText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SocialNetworks } from "../../components/footers/Footer";
import { TNSNameFinderModal } from "../../components/modals/teritoriNameService/TNSNameFinderModal";
import { FlowCard } from "../../components/teritoriNameService/FlowCard";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";

type NavItem = "TNSHome" | "TNSRegister" | "TNSExplore";

export const TNSHomeScreen: ScreenFC<"TNSHome"> = () => {
  const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);
  const [pressedNavItem, setPressedNavItem] = useState<NavItem>("TNSHome");
  const navigation = useAppNavigation();
  const landingHorizontalPadding = 25;
  const isKeplrConnected = useIsKeplrConnected();

  const onPressRegister = () => {
    setPressedNavItem("TNSRegister");
    setModalNameFinderVisible(true);
  };
  const onPressExplore = () => {
    setPressedNavItem("TNSExplore");
    setModalNameFinderVisible(true);
  };

  return (
    <ScreenContainer
      footerChildren={<SocialNetworks />}
      hideSidebar
      headerStyle={{ borderBottomColor: "transparent" }}
    >
      <IntroLogoText
        subTitle="Name Service Booking"
        style={{ marginTop: 40 }}
      />
      <View
        style={{
          marginHorizontal: "auto",
          marginTop: 40,
          paddingHorizontal: landingHorizontalPadding,
        }}
      >
        <FlowCard
          disabled={!isKeplrConnected}
          label="Register"
          description="Register and configure a new name"
          iconSVG={registerSVG}
          onPress={onPressRegister}
        />
        <FlowCard
          disabled={!isKeplrConnected}
          style={{ marginTop: 20 }}
          label="Manage"
          description="Transfer, edit, or burn a name that you own"
          iconSVG={manageSVG}
          onPress={() => navigation.navigate("TNSManage")}
        />
        <FlowCard
          style={{ marginTop: 20 }}
          label="Explore"
          description="Lookup addresses and explore registered names"
          iconSVG={exploreSVG}
          onPress={onPressExplore}
        />
      </View>

      <TNSNameFinderModal
        visible={modalNameFinderVisible}
        onClose={() => {
          setModalNameFinderVisible(false);
          navigation.navigate(pressedNavItem);
        }}
      />
    </ScreenContainer>
  );
};
