import React, { useEffect } from "react";
import { FlatList, View } from "react-native";

import { Label } from "../components/label/Label";
import { Date } from "../components/table/Date";
import { Datum } from "../components/table/Datum";
import { HeaderItem } from "../components/table/HeaderItem";
import { useContentContext } from "../context/ContentProvider";
import { useMyHistoryData } from "../query/useHistoryData";
interface HistoryItem {
  date: string;
  tickets: {
    bought: number;
    won: number;
  };
  toriWon: number;
}

const ListItem: React.FC<{
  item: HistoryItem;
  styleTypeSize: string;
}> = ({ item, styleTypeSize }) => {
  const { isMinimunWindowWidth } = useContentContext();

  const header = ["", "Tickets Bought", "Tickets WON", "$TORI WON"];
  const datumWidth = isMinimunWindowWidth ? 200 : 100;
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
        numColumns={4}
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
        <Date date={item.date} />

        <Datum
          value={item.tickets.bought}
          datumWidth={datumWidth}
          styleTypeSize={styleTypeSize}
          style={datumStyle}
        />
        <Datum
          value={item.tickets.won}
          datumWidth={datumWidth}
          styleTypeSize={styleTypeSize}
          style={datumStyle}
        />
        <Datum
          value={item.toriWon}
          datumWidth={datumWidth}
          styleTypeSize={styleTypeSize}
          style={datumStyle}
        />
      </View>
    </View>
  );
};

export const MyHistory = () => {
  const { isMinimunWindowWidth, selectedWallet } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  const { data, refetch: handleFetchHistoryData } = useMyHistoryData({
    selectedWallet,
  });

  useEffect(() => {
    handleFetchHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  return (
    <>
      <View
        style={{
          marginBottom: 40,
        }}
      >
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#E8E1EF",
            fontSize: isMinimunWindowWidth ? 95 : 40,
          }}
        >
          Punks, this is your history
        </Label>
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
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

      {data && (
        <FlatList
          contentContainerStyle={{
            alignItems: "center",
          }}
          data={data}
          renderItem={({ item }) => (
            <ListItem item={item} styleTypeSize={styleTypeSize} />
          )}
        />
      )}
    </>
  );
};
