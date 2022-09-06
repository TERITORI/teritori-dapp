import React, { useEffect, useState } from "react";
import { View } from "react-native";

import exploreSVG from "../../../assets/icons/explore.svg";
import manageSVG from "../../../assets/icons/manage.svg";
import registerSVG from "../../../assets/icons/register.svg";
import { SocialNetworks } from "../../components/Footer";
import { IntroLogoText } from "../../components/IntroLogoText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { FlowCard } from "../../components/teritoriNameService/FlowCard";
import { useTNS } from "../../context/TNSProvider";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import { neutral22 } from "../../utils/style/colors";

// "Find a name" modal
const ModalNameFinder: React.FC<{
  visible?: boolean;
  onClose: () => void;
  navItem: keyof RootStackParamList;
}> = ({ visible, navItem, onClose }) => {
  const navigation = useAppNavigation();
  const { name, setName } = useTNS();

  const onPressEnter = () => {
    if (name) {
      onClose();
      navigation.navigate(navItem);
    }
  };

  useEffect(() => {
    // Reset the name each time the modal appears
    if (visible) setName("");
  }, [visible]);

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      label="Find a name"
      // childrenBottom={<DomainsAvailability/>} TODO: Uncomment this when the functionality is done
    >
      <TextInputCustom
        squaresBackgroundColor={neutral22}
        label="NAME"
        placeHolder="Type name here"
        onPressEnter={onPressEnter}
        onChangeText={setName}
        value={name}
        regexp={new RegExp(/^[a-zA-Z]+$/)}
      />
    </ModalBase>
  );
};

export const TNSHomeScreen: React.FC = () => {
  const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);
  const [pressedNavItem, setPressedNavItem] =
    useState<keyof RootStackParamList>("TNSHome");
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

      <ModalNameFinder
        visible={modalNameFinderVisible}
        onClose={() => setModalNameFinderVisible(false)}
        navItem={pressedNavItem}
      />
    </ScreenContainer>
  );
};
