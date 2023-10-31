import { useEffect } from "react";
import { Linking, TouchableOpacity, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { BuyToripunksButton } from "../components/buttonLabel/BuyToripunksButton";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";
import { useComicHistoryData } from "../query/useComicBookHistory";

export const ComicBooks = () => {
  const { setSelectedSectionHandler, isMinimunWindowWidth, selectedWallet } =
    useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  const { data, refetch: handleFetchHistoryData } = useComicHistoryData({
    selectedWallet,
  });
  useEffect(() => {
    handleFetchHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  return (
    <>
      <View
        // @ts-expect-error
        style={{
          height: isMinimunWindowWidth ? "56vh" : "74vh",
          justifyContent: isMinimunWindowWidth ? "space-around" : "flex-end",
          alignItems: "center",
          paddingHorizontal: isMinimunWindowWidth ? 0 : 18,
          marginBottom: isMinimunWindowWidth ? 0 : "-2em",
          marginTop: isMinimunWindowWidth ? "6vh" : "none",
        }}
      >
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Punks, here's the prize
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          pool of the last
        </Label>
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            marginTop: 16,
            marginBottom: 16,
            transform: [{ rotate: "-1.5deg" }],
          }}
        >
          early punks wallet
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#E8E1EF",
            fontSize: isMinimunWindowWidth
              ? parseInt(styleTypeSize, 10) + 8
              : parseInt(styleTypeSize, 10),
          }}
        >
          {data[0]?.poolPrice} $TORI
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          DIVIDED BY {data[0]?.wallets} WALLETS
        </Label>
        <Label
          styleType="T1_Bebas_20"
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Holders of 1 toripunk + 5 different comic books
        </Label>
        <View
          style={{
            alignContent: "center",
            marginTop: 16,
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            height: 180,
          }}
        >
          <ButtonLabel
            text="BUY COMIC BOOKS"
            size="S"
            actionable
            onPress={() => {
              Linking.openURL(
                "/collection/tori-tori1syx6q5rxhntng93pmk9xep25638dqy3dcnppvvytnccxrp7urt7s2570jc",
              );
            }}
          />
          <BuyToripunksButton size="S" />

          <TouchableOpacity
            onPress={() => setSelectedSectionHandler("comic-book-history")}
          >
            <ButtonLabel text="PREVIOUS POOL PRIZES" size="S" actionable />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
