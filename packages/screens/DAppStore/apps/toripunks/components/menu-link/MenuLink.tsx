import { View } from "react-native";

import { TransparentButtonOutline } from "../../../../../../components/buttons/TransparentButtonOutline";
import { useContentContext } from "../../context/ContentProvider";

enum ListSection {
  price = "GIGANTIC LOTTERY",
  main = "RUSSIAN ROULETTE",
  raffle = "RAFFLE",
  comicgood = "COMIC BOOKS",
}

export const MenuLink = () => {
  const { setSelectedSectionHandler, selectedSection } = useContentContext();

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

  return (
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
  );
};
