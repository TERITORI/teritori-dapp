import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ActionButton } from "../components/action-button/ActionButton";
import { Button } from "../components/button/Button";
import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const Russian = () => {
  const [result, setResult] = useState<boolean>(false);
  const { isMinimunWindowWidth } = useContentContext();
  const [bet, setBet] = useState<number>(0);

  const styleTypeSize = isMinimunWindowWidth ? "80" : "30";
  const buttonSize = isMinimunWindowWidth ? "S" : "Mobile";

  // replace with user data.
  const userToripunks = "XXX";
  const maxTicket = "10";
  const priceTicket = "1";
  const monthPriceTicket = "120";
  const remainingUserTicket = "XXXX";
  const remainingUserCurrency = "XXXX";
  const winning = 10;
  const losing = 10;

  // Button text
  const longButtonLabelText = result
    ? `${remainingUserTicket} remaining tickets in the russian roulette`
    : `Last month's winnings per ticket = ${monthPriceTicket}$ Tor`;
  const userInteractionInfo = result
    ? `You can still buy ${remainingUserCurrency} tickets`
    : `${userToripunks} Toripunks in your wallet`;

  // use Hooks to buy, play, add bet , remove bet
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

  const buyToripunks = () => {};

  return (
    <View style={{ marginTop: isMinimunWindowWidth ? 70 : 40 }}>
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
          width: isMinimunWindowWidth ? 500 : 338,
        }}
      >
        <ActionButton
          text={bet}
          textWinning={winning}
          textLosing={losing}
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
            <ButtonLabel
              text={`Max ${maxTicket} tickets / transaction`}
              size={buttonSize}
            />
            <ButtonLabel
              text={`Ticket price = ${priceTicket} $TORI`}
              size={buttonSize}
            />
          </View>
        )}
        <ButtonLabel
          text={longButtonLabelText}
          size={buttonSize}
          style={{ width: "auto", marginBottom: 10 }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ButtonLabel text={userInteractionInfo} size={buttonSize} />
          <TouchableOpacity onPress={buyToripunks}>
            <ButtonLabel text="BUY TORIPUNKS" size={buttonSize} actionable />
          </TouchableOpacity>
        </View>
      </View>
      {/* Play View */}
      <View style={{ flexWrap: "wrap", alignContent: "center" }}>
        <Button
          onPress={click}
          text={result ? "PLAY AGAIN" : "PLAY"}
          size={isMinimunWindowWidth ? "L" : "L-mobile"}
          withImg
        />
      </View>
    </View>
  );
};
