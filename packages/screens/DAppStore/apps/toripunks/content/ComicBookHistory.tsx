import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { Datum } from "../components/table/Datum";
import { HeaderItem } from "../components/table/HeaderItem";
import { Round } from "../components/table/Round";
import { useContentContext } from "../context/ContentProvider";

interface HistoryItem {
  round: number;
  poolPrice: number;
  wallets: number;
}
const data: HistoryItem[] = [
  {
    round: 1,
    poolPrice: 107000,
    wallets: 3000,
  },
  {
    round: 2,
    poolPrice: 107000,
    wallets: 1000,
  },
  {
    round: 3,
    poolPrice: 107000,
    wallets: 1234,
  },
  {
    round: 4,
    poolPrice: 453,
    wallets: 123,
  },
];

const ListItem: React.FC<{
  item: HistoryItem;
  styleTypeSize: string;
}> = ({ item, styleTypeSize }) => {
  const header = ["", "Pool price $tori", "Numbers wallet"];
  const { isMinimunWindowWidth } = useContentContext();

  const datumWidth = isMinimunWindowWidth ? 320 : 160;
  const roundWidth = isMinimunWindowWidth ? 52 : 22;
  const datumStyle = {
    backgroundColor: "#212708",
    padding: isMinimunWindowWidth ? 30 : 10,
    width: datumWidth,
  };
  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
      }}
    >
      <FlatList
        contentContainerStyle={{
          width: "100%",
        }}
        data={header}
        numColumns={3}
        renderItem={({ item }) => (
          <HeaderItem
            text={item}
            datumWidth={datumWidth}
            roundWidth={roundWidth}
          />
        )}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        <Round round={item.round} />

        <Datum
          value={item.poolPrice}
          datumWidth={datumWidth}
          style={datumStyle}
          styleTypeSize={styleTypeSize}
        />
        <Datum
          value={item.wallets}
          datumWidth={datumWidth}
          style={datumStyle}
          styleTypeSize={styleTypeSize}
        />
      </View>
    </View>
  );
};

export const ComicBookHistory = () => {
  const { setSelectedSectionHandler, isMinimunWindowWidth } =
    useContentContext();
  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";
  return (
    <View
      style={{
        flexWrap: "nowrap",
        alignItems: "center",
        marginBottom: "3em",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            transform: [{ rotate: "-90deg" }],
            position: "absolute",
            left: -556,
            width: "max-content",
          }}
        >
          early punk wallet
        </Label>
        <FlatList
          contentContainerStyle={{
            alignItems: "center",
            marginTop: 80,
            marginBottom: "7em",
          }}
          data={data}
          renderItem={({ item }) => (
            <ListItem item={item} styleTypeSize={styleTypeSize} />
          )}
        />
      </View>

      <TouchableOpacity onPress={() => setSelectedSectionHandler("comicbook")}>
        <ButtonLabel text="BACK" size="S" actionable />
      </TouchableOpacity>
    </View>
  );
};
