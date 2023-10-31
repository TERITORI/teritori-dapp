import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { Date } from "../components/table/Date";
import { Datum } from "../components/table/Datum";
import { HeaderItem } from "../components/table/HeaderItem";
import { useContentContext } from "../context/ContentProvider";
import { useGiganticHistoryData } from "../query/useGiganticHistory";

const ListItem: React.FC<{
  item: { date: string; toriWon: number };
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
        <Date date={item.date} />

        <Datum
          value={`${item.toriWon} $TORI WON`}
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
  const { isMinimunWindowWidth, selectedWallet } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  const { data, refetch: handleFetchHistoryData } = useGiganticHistoryData({
    selectedWallet,
  });

  useEffect(() => {
    handleFetchHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  return (
    <View
      // @ts-expect-error
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
          // @ts-expect-error
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
          // @ts-expect-error
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
