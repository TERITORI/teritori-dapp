import {
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";

import { useNSUserInfo } from "../../../../../hooks/useNSUserInfo";
import { tinyAddress } from "../../../../../utils/text";
import { Button } from "../components/button/Button";
import { useContentContext } from "../context/ContentProvider";

const LINKS = [
  {
    name: "gigantic lottery",
    section: "lottery",
    historySection: "lottery-history",
  },
  {
    name: "Russian roulette",
    section: "roulette",
    historySection: "my-history",
    style: { marginTop: 30 },
  },
  {
    name: "Raffle",
    section: "raffle",
    historySection: "",
    style: { marginTop: 30 },
  },
  {
    name: "Comic books",
    section: "comicbook",
    historySection: "comic-book-history",
    style: { marginTop: 30 },
  },
];

export const MenuMobile = () => {
  const { setSelectedSectionHandler, selectedWallet, styles } =
    useContentContext();

  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const name =
    userInfo?.metadata?.tokenId ||
    tinyAddress(selectedWallet?.address, 15) ||
    "";
  const textStyle =
    name === "" ? { fontFamily: "Dafter Harder Better Stronger" } : {};

  const selectSection = (section: string) => {
    setSelectedSectionHandler(section);
  };

  const Separator = () => (
    <View
      style={{
        borderRightWidth: 2,
        marginHorizontal: 10,
        // marginVertical: 2,
        width: 2,
        borderColor: "#2AF191",
        height: "90%",
      }}
    />
  );

  const BuildLink = ({
    name,
    section,
    historySection,
    style,
  }: {
    name: string;
    section: string;
    historySection: string;
    style?: StyleProp<ViewStyle>;
  }) => {
    return (
      <View style={[style, { flexDirection: "row" }]}>
        <TouchableOpacity
          onPress={() => {
            selectSection(section);
          }}
        >
          <Text style={[[styles["T1_Bebas_20"]], { color: "#E8E1EF" }]}>
            {name}
          </Text>
        </TouchableOpacity>
        {Separator()}
        {historySection && (
          <TouchableOpacity
            onPress={() => {
              selectSection(historySection);
            }}
          >
            <Text style={[[styles["T1_Bebas_20"]], { color: "#E8E1EF" }]}>
              Historic
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Button
        onPress={() => {}}
        text={name !== "" ? name : "connect"}
        size="S"
        withImg
        textStyle={textStyle}
      />
      <View style={{ marginTop: 78 }}>
        {LINKS.map((LINK) => BuildLink(LINK))}
      </View>
    </View>
  );
};
