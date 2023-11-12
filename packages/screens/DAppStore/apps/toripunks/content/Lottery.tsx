import { useEffect } from "react";
import { Linking, TouchableOpacity, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { BuyToripunksButton } from "../components/buttonLabel/BuyToripunksButton";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";
import { useGiganticLastReward } from "../query/useGiganticHistory";

export const Lottery = () => {
  const { setSelectedSectionHandler, isMinimunWindowWidth } =
    useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  const { data: lastRewards, refetch: handleGetLasRewards } =
    useGiganticLastReward();

  useEffect(() => {
    handleGetLasRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View
        // @ts-expect-error
        style={{
          height: isMinimunWindowWidth ? "57vh" : "73vh",
          paddingHorizontal: isMinimunWindowWidth ? 0 : 18,
          justifyContent: "flex-end",
          marginTop: isMinimunWindowWidth ? "6vh" : "none",
        }}
      >
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Punks, here's the prize pool of the last
        </Label>
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            marginBottom: 24,
            transform: [{ rotate: "-1.5deg" }],
          }}
        >
          gigantic lottery
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#E8E1EF",
            fontSize: parseInt(styleTypeSize, 10) + 20,
          }}
        >
          {lastRewards} $TORI
        </Label>
        <Label
          styleType="T1_Bebas_20"
          style={{ textAlign: "center", color: "#E8E1EF", marginTop: 24 }}
          onPress={() => Linking.openURL("https://discord.gg/n6QdEXXGzP")}
        >
          Live draw in our discord on the 15th of each month
        </Label>
        <View
          style={{
            alignContent: "center",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            height: 120,
            marginTop: 40,
          }}
        >
          <BuyToripunksButton size="S" />

          <TouchableOpacity
            onPress={() => setSelectedSectionHandler("lottery-history")}
          >
            <ButtonLabel text="PREVIOUS LOTTERIES" size="S" actionable />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
