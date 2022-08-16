import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import exploreIconPNG from "../../../assets/icons/explore.png";
import manageIconPNG from "../../../assets/icons/manage.png";
import registerIconPNG from "../../../assets/icons/register.png";
import { SocialNetworks } from "../../components/Footer";
import { IntroLogoText } from "../../components/IntroLogoText";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { FlowCard } from "../../components/cards/FlowCard";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { TNSContext } from "../../context/TNSProvider";
import { useStore } from "../../store/cosmwasm";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import {PrimaryButton} from "../../components/buttons/PrimaryButton"
import {useWallets} from "../../context/WalletsProvider"
import {useIsKeplrConnected} from "../../hooks/useIsKeplrConnected"

// "Find a name" modal
const ModalNameFinder: React.FC<{
  visible?: boolean;
  onClose: () => void;
  navItem: keyof RootStackParamList;
}> = ({ visible, navItem, onClose }) => {
  const navigation = useAppNavigation();
  const { name, setName } = useContext(TNSContext);

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
  const isKeplrConnected = useIsKeplrConnected()

  const onPressRegister = () => {
    setPressedNavItem("TNSRegister");
    setModalNameFinderVisible(true);
  };
  const onPressExplore = () => {
    setPressedNavItem("TNSExplore");
    setModalNameFinderVisible(true);
  };

  return (
    <ScreenContainer2 footerChildren={<SocialNetworks />}>
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
          iconSource={registerIconPNG}
          onPress={onPressRegister}
        />
        <FlowCard
          disabled={!isKeplrConnected}
          style={{ marginTop: 20 }}
          label="Manage"
          description="Transfer, edit, or burn a name that you own"
          iconSource={manageIconPNG}
          onPress={() => navigation.navigate("TNSManage")}
        />
        <FlowCard
          style={{ marginTop: 20 }}
          label="Explore"
          description="Lookup addresses and explore registered names"
          iconSource={exploreIconPNG}
          onPress={onPressExplore}
        />
      </View>

      <ModalNameFinder
        visible={modalNameFinderVisible}
        onClose={() => setModalNameFinderVisible(false)}
        navItem={pressedNavItem}
      />
    </ScreenContainer2>
  );
};

// Just a container that it can be added at the bottom of the modal TODO: Integrate this later
// const DomainsAvailability: React.FC = () => {
//   const s = StyleSheet.create({
//     labelStyle: {
//       fontSize: 14,
//       color: neutral77,
//       marginBottom: 8,
//     },
//     domainStyle: {
//       fontSize: 16,
//       color: neutral77,
//       marginRight: 16,
//     },
//     domainsContainerStyle: {
//       flex: 1,
//       flexDirection: "row",
//       alignItems: "center",
//       width: "100%",
//     },
//   });
//
//   return (
//     <View
//       style={{
//         backgroundColor: "#000000",
//         borderWidth: 1,
//         borderColor: neutral33,
//         borderRadius: 8,
//         width: "100%",
//         height: 160,
//         flex: 1,
//         justifyContent: "space-between",
//         paddingVertical: 24,
//         paddingHorizontal: 20,
//       }}
//     >
//       <BrandText style={s.labelStyle}>Available domains:</BrandText>
//       {/* ---- Domains that exist (With status minted or not) */}
//       <View style={s.domainsContainerStyle}>
//         {domainsList
//           .filter((domain) => !domain.comingSoon)
//           .map((domain) => (
//             <BrandText
//               key={domain.name}
//               style={[
//                 s.domainStyle,
//                 { color: domain.minted ? errorColor : successColor },
//               ]}
//             >
//               {domain.name}
//             </BrandText>
//           ))}
//       </View>
//       <BrandText style={[s.labelStyle, { marginTop: 24 }]}>
//         Coming soon domains:
//       </BrandText>
//       {/* ---- Domains that not exist */}
//       <View style={s.domainsContainerStyle}>
//         {domainsList
//           .filter((domain) => domain.comingSoon)
//           .map((domain) => (
//             <BrandText key={domain.name} style={s.domainStyle}>
//               {domain.name}
//             </BrandText>
//           ))}
//         <BrandText style={[s.domainStyle, { marginRight: 0 }]}>
//           and more
//         </BrandText>
//       </View>
//     </View>
//   );
// };
