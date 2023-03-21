import { useState } from "react";
import { View } from "react-native";

import { ActionButton } from "../components/action-button/ActionButton";
import { Button } from "../components/button/Button";
import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Footer } from "../components/footer/Footer";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const Russian = () => {
  const [result, setResult] = useState<boolean>(false);
  const { isMinimunWindowWidth } = useContentContext();
  const [bet, setBet] = useState<number>(0);

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  const click = () => {
    setResult(!result);
  };

  const addBet = () => {
    setBet(bet + 1);
  };
  const reduceBet = () => {
    const validateBet = bet - 1 < 0 ? 0 : bet - 1;
    setBet(validateBet);
  };

  return (
    <View>
      {/* Label View */}
      <View>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          {!result ? "PUNKS, IT’S TIME TO BUY YOUR" : " "}
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          {!result ? "TICKETS FOR THE one & only" : "Punks, you Played"}
        </Label>
        )
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            transform: [{ rotate: "-1.69deg" }],
          }}
        >
          {result ? "Russian roulette" : "Here are your results"}
        </Label>
      </View>
      {/* Action View */}
      <View
        style={{
          height: 270,
          marginTop: 50,
          marginLeft: "auto",
          marginRight: "auto",
          width: 500,
        }}
      >
        <ActionButton
          text={bet}
          addHandler={addBet}
          reduceHandler={reduceBet}
          result={result}
        />
        {!result && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <ButtonLabel text="Max 10 tickets / transaction" size="S" />
            <ButtonLabel text="Ticket price = 1 $TORI" size="S" />
          </View>
        )}
        <ButtonLabel
          text="Last month's winnings per ticket = 120$ Tor"
          size="S"
          style={{ width: "auto", marginBottom: 10 }}
        />
        <View style={{ flexDirection: "row" }}>
          <ButtonLabel text="Toripunks in your wallet" size="S" />
        </View>
      </View>
      {/* Play View */}
      <View style={{ flexWrap: "wrap", alignContent: "center" }}>
        <Button onPress={click} text="PLAY" size="L" withImg />
      </View>
      <View style={{ marginTop: 78 }}>
        <Footer isMinimunWindowWidth={isMinimunWindowWidth} />
      </View>
    </View>
  );
};
