import { TouchableOpacity, View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const ComicBooks = () => {
  const { setSelectedSectionHandler, isMinimunWindowWidth } =
    useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  return (
    <>
      <View
        style={{
          maxHeight: "100vh",
          marginTop: 87,
        }}
      >
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Punks, here's the prize
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          pool of the last
        </Label>
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            transform: [{ rotate: "-1.5deg" }],
          }}
        >
          early punks wallet
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          DIVIDED BY XXXX WALLETS
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
          Holders of 1 toripunk + 5 different comic books
        </Label>
        <View
          style={{
            alignContent: "center",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            height: 180,
          }}
        >
          <ButtonLabel text="BUY COMIC BOOKS" size="S" actionable />
          <ButtonLabel text="BUY TORIPUNKS" size="S" actionable />

          <TouchableOpacity
            onPress={() => setSelectedSectionHandler("comic-book-history")}
          >
            <ButtonLabel text="PREVIOUS POOL PRICE" size="S" actionable />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
