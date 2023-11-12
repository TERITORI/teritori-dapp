import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { Date } from "../components/table/Date";
import { Datum } from "../components/table/Datum";
import { HeaderItem } from "../components/table/HeaderItem";
import { useContentContext } from "../context/ContentProvider";
import { useComicHistoryData } from "../query/useComicBookHistory";

interface HistoryItem {
  date: string;
  poolPrice: number;
  wallets: number;
}

const ListItem: React.FC<{
  item: HistoryItem;
  styleTypeSize: string;
}> = ({ item, styleTypeSize }) => {
  const header = ["", "Pool prize $tori", "Number of wallets"];
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
        <Date date={item.date} />

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
    <View
      // @ts-expect-error
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
          // @ts-expect-error
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
          // @ts-expect-error
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
