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
  text: string;
}
const datumWidth = 320; //720;
const roundWidth = 52;
const data: HistoryItem[] = [
  {
    round: 1,
    text: "150 000 $TORI WON",
  },
  {
    round: 2,
    text: "150 000 $TORI WON",
  },
  {
    round: 3,
    text: "150 000 $TORI WON",
  },
  {
    round: 4,
    text: "150 000 $TORI WON",
  },
];
//
// const HeaderItem = ({ text }: { text: string }) => (
//   <View
//     style={{
//       justifyContent: "center",
//       width: text === "" ? roundWidth : datumWidth,
//     }}
//   >
//     <Label
//       styleType="T2_Bebas_20"
//       style={{
//         justifyContent: "center",
//         textAlign: "center",
//         color: "#E8E1EF",
//       }}
//     >
//       {text}
//     </Label>
//   </View>
// );

// const RoundNumber: React.FC<{ round: number }> = ({ round }) => (
//   <View
//     style={{
//       justifyContent: "center",
//     }}
//   >
//     <Label
//       styleType="T2_Bebas_20"
//       style={{
//         color: "#E8E1EF",
//         transform: [{ rotate: "-90deg" }],
//       }}
//     >
//       Round {round}
//     </Label>
//   </View>
// );

// const Datum: React.FC<{ value: string }> = ({ value }) => (
//   <View
//     style={{
//       backgroundColor: "#28f191",
//       padding: 30,
//       width: datumWidth,
//     }}
//   >
//     <Label
//       styleType="H1_Bebas_80"
//       style={{ textAlign: "center", color: "#E8E1EF" }}
//     >
//       {value}
//     </Label>
//   </View>
// );

const ListItem: React.FC<{
  item: HistoryItem;
  styleTypeSize: string;
}> = ({ item, styleTypeSize }) => {
  const { isMinimunWindowWidth } = useContentContext();

  const header = ["", " "]; // yes " " hack :(
  const datumWidth = isMinimunWindowWidth ? 720 : 280;
  const roundWidth = isMinimunWindowWidth ? 52 : 22;

  const datumStyle = {
    backgroundColor: "#28f191",
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
        numColumns={2}
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
          value={item.text}
          datumWidth={datumWidth}
          styleTypeSize={styleTypeSize}
          style={datumStyle}
        />
      </View>
    </View>
  );
};

export const LotteryHistory = () => {
  const { setSelectedSectionHandler } = useContentContext();
  const { isMinimunWindowWidth } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  return (
    <View
      style={{
        flexWrap: "nowrap",
        alignItems: "center",
        marginBottom: "3em",
        marginTop: 90,
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
            left: -500,
            width: "max-content",
          }}
        >
          gigantic lottery
        </Label>
        <FlatList
          contentContainerStyle={{
            alignItems: "center",
            marginBottom: "7em",
          }}
          data={data}
          renderItem={({ item }) => (
            <ListItem item={item} styleTypeSize={styleTypeSize} />
          )}
        />
      </View>
      <TouchableOpacity onPress={() => setSelectedSectionHandler("lottery")}>
        <ButtonLabel text="BACK" size="S" actionable />
      </TouchableOpacity>
    </View>
  );
};
