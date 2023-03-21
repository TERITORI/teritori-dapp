import React from "react";
import { FlatList, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

interface HistoryItem {
  round: number;
  poolPrice: number;
  wallets: number;
}
const datumWidth = 320;
const roundWidth = 52;
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

const HeaderItem = ({ text }: { text: string }) => (
  <View
    style={{
      justifyContent: "center",
      width: text === "" ? roundWidth : datumWidth,
    }}
  >
    <Label
      styleType="T2_Bebas_20"
      style={{
        justifyContent: "center",
        textAlign: "center",
        color: "#E8E1EF",
      }}
    >
      {text}
    </Label>
  </View>
);

const RoundNumber: React.FC<{ round: number }> = ({ round }) => (
  <View
    style={{
      justifyContent: "center",
    }}
  >
    <Label
      styleType="T2_Bebas_20"
      style={{
        color: "#E8E1EF",
        transform: [{ rotate: "-90deg" }],
      }}
    >
      Round {round}
    </Label>
  </View>
);

const Datum: React.FC<{ value: number }> = ({ value }) => (
  <View
    style={{
      backgroundColor: "#212708",
      padding: 30,
      width: datumWidth,
    }}
  >
    <Label
      styleType="H1_Bebas_80"
      style={{ textAlign: "center", color: "#E8E1EF" }}
    >
      {value}
    </Label>
  </View>
);

const ListItem: React.FC<{ item: HistoryItem }> = ({ item }) => {
  const header = ["", "Pool price $tori", "Numbers wallet"];
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
        renderItem={({ item }) => <HeaderItem text={item} />}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        <RoundNumber round={item.round} />

        <Datum value={item.poolPrice} />
        <Datum value={item.wallets} />
      </View>
    </View>
  );
};

export const ComicBookHistory = () => {
  const { setSelectedSectionHandler } = useContentContext();
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
          styleType="H2_DHBS_80"
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
            marginBottom: "7em",
          }}
          data={data}
          renderItem={({ item }) => <ListItem item={item} />}
        />
      </View>
      <ButtonLabel
        text="BACK"
        size="S"
        onPress={() => setSelectedSectionHandler("comicbook")}
      />
    </View>
  );
};
