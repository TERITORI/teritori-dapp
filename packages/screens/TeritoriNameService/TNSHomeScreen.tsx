import { useLinkTo } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import TNSBannerPNG from "../../../assets/banners/tns.png";
import exploreSVG from "../../../assets/icons/explore-neutral77.svg";
import penSVG from "../../../assets/icons/pen-neutral77.svg";
import registerSVG from "../../../assets/icons/register-neutral77.svg";
import { BrandText } from "../../components/BrandText";
import { IntroLogoText } from "../../components/IntroLogoText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TNSNameFinderModal } from "../../components/modals/teritoriNameService/TNSNameFinderModal";
import { FlowCard } from "../../components/teritoriNameService/FlowCard";
import { useTNS } from "../../context/TNSProvider";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { TNSBurnNameScreen } from "./TNSBurnNameScreen";
import { TNSConsultNameScreen } from "./TNSConsultNameScreen";
import { TNSExploreScreen } from "./TNSExploreScreen";
import { TNSManageScreen } from "./TNSManageScreen";
import { TNSMintNameScreen } from "./TNSMintNameScreen";
import { TNSRegisterScreen } from "./TNSRegisterScreen";
import { TNSUpdateNameScreen } from "./TNSUpdateNameScreen";
export type TNSItems = "TNSManage" | "TNSRegister" | "TNSExplore";
export type TNSModals =
  | "TNSManage"
  | "TNSRegister"
  | "TNSExplore"
  | "TNSConsultName"
  | "TNSMintName"
  | "TNSUpdateName"
  | "TNSBurnName";

const TNSPathMap = {
  TNSManage: "manage",
  TNSRegister: "register",
  TNSExplore: "explore",
  TNSConsultName: "consult-name",
  TNSMintName: "mint",
  TNSUpdateName: "update-name",
  TNSBurnName: "burn-name",
};

export type TNSCloseHandler = (
  modalName?: TNSModals,
  navigateTo?: TNSModals
) => void;

export interface TNSModalCommonProps {
  onClose: TNSCloseHandler;
  navigateBackTo?: TNSModals;
}

const LG_BREAKPOINT = 1600;
const MD_BREAKPOINT = 820;

export const TNSHomeScreen: ScreenFC<"TNSHome"> = ({ route }) => {
  const { width } = useWindowDimensions();

  const linkTo = useLinkTo();
  const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);
  const [pressedTNSItems, setPressedTNSItems] = useState<TNSItems>();
  const [activeModal, setActiveModal] = useState<TNSModals>();
  const [navigateBackTo, setNavigateBackTo] = useState<TNSModals>();
  const { setName } = useTNS();
  const navigation = useAppNavigation();

  const isKeplrConnected = useIsKeplrConnected();

  const onPressRegister = () => {
    setPressedTNSItems("TNSRegister");
    setModalNameFinderVisible(true);
  };
  const onPressExplore = () => {
    setPressedTNSItems("TNSExplore");
    setModalNameFinderVisible(true);
  };

  const handleModalClose: TNSCloseHandler = (modalName, navigateBackTo) => {
    if (modalName) {
      linkTo(`/tns/${TNSPathMap[modalName]}`);
      setNavigateBackTo(navigateBackTo);
    } else {
      linkTo("/tns");
      setName("");
    }
  };

  const handleModalChange = (modal?: string) => {
    if (!modal) {
      setActiveModal(undefined);
      return;
    }
    try {
      //@ts-ignore
      const routeName = Object.keys(TNSPathMap).find(
        //@ts-ignore
        (key) => TNSPathMap[key] === modal
      );
      //@ts-ignore
      setActiveModal(routeName);
    } catch (err) {
      console.log("route path parsing failed", err);
    }
  };

  useEffect(() => {
    handleModalChange(route.params?.modal);
    if (route.params?.name) {
      setName(route.params.name);
    }
  }, [route.params?.modal]);

  const tnsModalCommonProps = {
    onClose: handleModalClose,
    navigateBackTo,
  };

  return (
    <ScreenContainer
      noMargin={width <= 1600}
      headerStyle={{ borderBottomColor: "transparent" }}
      headerChildren={<BrandText>Name Service</BrandText>}
    >
      <View
        style={{
          marginHorizontal: 32,
        }}
      >
        <IntroLogoText
          title="Teritori Name Service"
          backgroundImage={TNSBannerPNG}
        />
        <View
          style={{
            marginTop: width >= LG_BREAKPOINT ? 120 : 80,
            marginBottom: 20,
            flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
            justifyContent: "center",
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
            label="Manage"
            description="Transfer, edit, or burn a name that you own"
            iconSVG={penSVG}
            onPress={() => navigation.navigate("TNSHome", { modal: "manage" })}
            style={{
              marginHorizontal: width >= MD_BREAKPOINT ? 12 : 0,
              marginVertical: width >= MD_BREAKPOINT ? 0 : 12,
            }}
          />
          <FlowCard
            label="Explore"
            description="Lookup addresses and explore registered names"
            iconSVG={exploreSVG}
            onPress={onPressExplore}
            style={{}}
          />
        </View>

        <TNSNameFinderModal
          visible={modalNameFinderVisible}
          onClose={() => {
            setModalNameFinderVisible(false);
          }}
          onEnter={() => {
            setModalNameFinderVisible(false);
            pressedTNSItems && linkTo(`/tns/${TNSPathMap[pressedTNSItems]}`);
          }}
        />
        {activeModal === "TNSManage" && (
          <TNSManageScreen {...tnsModalCommonProps} />
        )}
        {activeModal === "TNSExplore" && (
          <TNSExploreScreen {...tnsModalCommonProps} />
        )}
        {activeModal === "TNSRegister" && (
          <TNSRegisterScreen {...tnsModalCommonProps} />
        )}
        {activeModal === "TNSMintName" && (
          <TNSMintNameScreen {...tnsModalCommonProps} />
        )}
        {activeModal === "TNSConsultName" && (
          <TNSConsultNameScreen {...tnsModalCommonProps} />
        )}
        {activeModal === "TNSUpdateName" && (
          <TNSUpdateNameScreen {...tnsModalCommonProps} />
        )}
        {activeModal === "TNSBurnName" && (
          <TNSBurnNameScreen {...tnsModalCommonProps} />
        )}
      </View>
    </ScreenContainer>
  );
};
