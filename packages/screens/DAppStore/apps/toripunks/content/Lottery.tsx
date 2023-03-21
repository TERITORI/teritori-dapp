import { View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Footer } from "../components/footer/Footer";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const Lottery = () => {
  const { setSelectedSectionHandler, isMinimunWindowWidth } =
    useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  return (
    <>
      <View
        style={{
          maxHeight: "100vh",
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
            transform: [{ rotate: "-1.5deg" }],
          }}
        >
          gigantic lottery
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          2500000 $TORI
        </Label>
        <Label
          styleType="T1_Bebas_20"
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Live draw in our discord on the 25th of each month
        </Label>
        <View
          style={{
            alignContent: "center",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            height: 120,
          }}
        >
          <ButtonLabel text="BUY TORIPUNKS" size="S" />
          <ButtonLabel
            text="PREVIOUS LOTTERIES"
            size="S"
            onPress={() => setSelectedSectionHandler("lottery-history")}
          />
        </View>

        <Footer isMinimunWindowWidth={isMinimunWindowWidth} />
      </View>
    </>
  );
};
