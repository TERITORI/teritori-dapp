import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { useMyHistoryLotteryData } from "../../../query/useHistoryData";
import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { Datum } from "../components/table/Datum";
import { HeaderItem } from "../components/table/HeaderItem";
import { Round } from "../components/table/Round";
import { useContentContext } from "../context/ContentProvider";

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
        <Round round={item.date} />

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
  const { setSelectedSectionHandler, selectedWallet } = useContentContext();
  const { isMinimunWindowWidth } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  const { data, refetch: handleFetchHistoryData } = useMyHistoryLotteryData({
    selectedWallet,
  });

  useEffect(() => {
    handleFetchHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);
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
