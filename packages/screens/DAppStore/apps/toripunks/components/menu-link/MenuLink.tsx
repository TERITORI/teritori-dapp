import { ImageBackground, TouchableOpacity, View } from "react-native";

import { TransparentButtonOutline } from "../../../../../../components/buttons/TransparentButtonOutline";
import { useNSUserInfo } from "../../../../../../hooks/useNSUserInfo";
import { tinyAddress } from "../../../../../../utils/text";
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
  const { setSelectedSectionHandler, selectedSection, isMinimunWindowWidth } =
    useContentContext();
  const contentContext = useContentContext();
  const userInfo = useNSUserInfo(contentContext.selectedWallet?.userId);
  const name =
    userInfo?.metadata?.tokenId ||
    tinyAddress(contentContext.selectedWallet?.address, 30) ||
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
    setSelectedSectionHandler("menu-mobile");
  };

  return isMinimunWindowWidth ? (
    <>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
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
          {name !== "" && (
            <Button
              onPress={() => {
                setSelectedSectionHandler("disconnect");
              }}
              text={name}
              size="S"
              withImg
            />
          )}
          {contentContext.selectedWallet ? (
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
  ) : (
    //Mobile menu
    <TouchableOpacity onPress={menuSelectedSection}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <ImageBackground
          source={menuButton}
          resizeMode="contain"
          style={{ height: 30, width: 30, marginTop: 18, marginLeft: 19 }}
        />
      </View>
    </TouchableOpacity>
  );
};
