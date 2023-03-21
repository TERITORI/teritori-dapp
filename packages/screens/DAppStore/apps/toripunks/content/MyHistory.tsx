import React from "react";
import { FlatList, View } from "react-native";

import { Label } from "../components/label/Label";
interface HistoryItem {
  round: number;
  tickets: {
    bought: number;
    won: number;
  };
  toriWon: number;
}
const datumWidth = 200;
const roundWidth = 52;
const data: HistoryItem[] = [
  {
    round: 1,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 2,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 3,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 4,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 5,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 6,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 7,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
  },
  {
    round: 8,
    tickets: {
      bought: 107,
      won: 40,
    },
    toriWon: 3000,
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
  const header = ["", "Tickets Bought", "Tickets WON", "$TORI WON"];
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
        numColumns={4}
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

        <Datum value={item.tickets.bought} />
        <Datum value={item.tickets.won} />
        <Datum value={item.toriWon} />
      </View>
    </View>
  );
};

export const MyHistory = () => {
  return (
    <>
      <View
        style={{
          marginBottom: 40,
        }}
      >
        <Label
          styleType="H1_Bebas_80"
          style={{ textAlign: "center", color: "#E8E1EF", fontSize: 95 }}
        >
          Punks, this is your history
        </Label>
        <Label
          styleType="H2_DHBS_80"
          style={{
            textAlign: "center",
            color: "#FFD753",
            transform: [{ rotate: "-1.69deg" }],
            marginTop: 16,
          }}
        >
          Build together
        </Label>
      </View>

      <FlatList
        contentContainerStyle={{
          alignItems: "center",
        }}
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
      />
    </>
  );
};
