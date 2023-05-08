import { useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";

import { TransparentButtonOutline } from "../../../../../../components/buttons/TransparentButtonOutline";
import { useNSUserInfo } from "../../../../../../hooks/useNSUserInfo";
import { tinyAddress } from "../../../../../../utils/text";
import exitButton from "../../assets/exit.png";
import menuButton from "../../assets/menuButton.png";
import { useContentContext } from "../../context/ContentProvider";
import { Button } from "../button/Button";

enum ListSection {
  lottery = "GIGANTIC LOTTERY",
  roulette = "RUSSIAN ROULETTE",
  raffle = "RAFFLE",
  comicbook = "COMIC BOOKS",
}

export const MenuLink = () => {
  const {
    setSelectedSectionHandler,
    selectedSection,
    isMinimunWindowWidth,
    selectedWallet,
  } = useContentContext();
  const [prevSelectedSection, setPrevSelectedSection] =
    useState<string>("welcome");
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const name =
    userInfo?.metadata?.tokenId ||
    tinyAddress(selectedWallet?.address, 15) ||
    "";

  const Separator = () => (
    <View
      style={{
        borderRightWidth: 2,
        marginHorizontal: 10,
        marginVertical: 10,
        width: 20,
        borderColor: "#2AF191",
      }}
    />
  );

  const changeSelectedSection = () => {
    const target = event?.target as HTMLElement;
    const selectedIndex = Object.values(ListSection).findIndex(
      (sect) => sect === target.textContent
    );
    setSelectedSectionHandler(Object.keys(ListSection)[selectedIndex]);
  };

  const menuSelectedSection = () => {
    setPrevSelectedSection(selectedSection);
    setSelectedSectionHandler("menu-mobile");
  };

  const exitMenuSelection = () => {
    setSelectedSectionHandler(prevSelectedSection);
  };

  return isMinimunWindowWidth ? (
    <>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
          zIndex: 1,
        }}
      >
        {(Object.keys(ListSection) as (keyof typeof ListSection)[]).map(
          (link, index) => {
            return (
              <View key={`link-key-${link}`} style={{ flexDirection: "row" }}>
                <TransparentButtonOutline
                  size="M"
                  text={ListSection[link]}
                  borderColor="transparent"
                  squaresBackgroundColor="transparent"
                  onPress={changeSelectedSection}
                  color={link === selectedSection ? "#2AF191" : "#E8E1EF"}
                />
                {index !== Object.keys(ListSection).length - 1 && Separator()}
              </View>
            );
          }
        )}
      </View>
      {selectedSection !== "welcome" && (
        <View
          style={{
            display: "flex",
            position: "relative",
            zIndex: 100,
            right: 30,
            top: -40,
            width: "fit-content",
            alignSelf: "flex-end",
          }}
        >
          {name !== "" && <Button text={name} size="S" withImg disabled />}
          {selectedWallet ? (
            <Button
              onPress={() => {
                setSelectedSectionHandler("my-history");
              }}
              text="MY HISTORY"
              size="S"
              withImg
              revert
            />
          ) : null}
        </View>
      )}
    </>
  ) : //Mobile menu
  !(selectedSection === "menu-mobile") ? (
    <TouchableOpacity onPress={menuSelectedSection}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
          top: 0,
          left: 0,
          marginBottom: 40,
        }}
      >
        <ImageBackground
          source={menuButton}
          resizeMode="contain"
          style={{ height: 30, width: 30, marginTop: 18, marginLeft: 19 }}
        />
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={exitMenuSelection}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
          top: 0,
          justifyContent: "flex-end",
        }}
      >
        <ImageBackground
          source={exitButton}
          resizeMode="contain"
          style={{ height: 30, width: 30, marginTop: 18, marginRight: 19 }}
        />
      </View>
    </TouchableOpacity>
  );
};
