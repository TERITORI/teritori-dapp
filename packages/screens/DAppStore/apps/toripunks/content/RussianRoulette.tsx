import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import {
  Sort,
  SortDirection,
} from "../../../../../api/marketplace/v1/marketplace";
import { useNFTs } from "../../../../../hooks/useNFTs";
import { ActionButton } from "../components/action-button/ActionButton";
import { Button } from "../components/button/Button";
import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { BuyToripunksButton } from "../components/buttonLabel/BuyToripunksButton";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

const errorTypeMsg = {
  TICKET: {
    title1: "PUNKS, You can't buy more tickets",
    title2: "than the number of NFT you own",
    subTitle: "One punk , one ticket",
  },
  NFT: {
    title1: "PUNKS, All your nft’s",
    title2: "already have a ticket",
    subTitle: "One punk , one ticket",
  },
  TRANSACTION: {
    title1: "PUNKS, we have a problem",
    title2: "on the transaction",
    subTitle: "Check your funds !",
  },
  "": {
    title1: "",
    title2: "",
    subTitle: "",
  },
};

export const Russian = () => {
  const [result, setResult] = useState<boolean>(false);
  const { isMinimunWindowWidth, setLoadingGame } = useContentContext();
  const [bet, setBet] = useState<number>(0);
  const count = useToripunks();

  const [errorType, setErroType] = useState<
    "TICKET" | "NFT" | "TRANSACTION" | ""
  >("");

  const styleTypeSize = isMinimunWindowWidth ? "80" : "30";
  const buttonSize = isMinimunWindowWidth ? "S" : "Mobile";

  // replace with user data.
  const userToripunks = count;
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

  const delay = (ms: number | undefined) =>
    new Promise((res) => setTimeout(res, ms));

  // use Hooks to buy, play, add bet , remove bet
  const click = async () => {
    setLoadingGame(true);
    await delay(1000);
    setResult(!result);
    await delay(2000);
    setLoadingGame(false);
  };

  const addBet = () => {
    const validateBet = bet + 1 > +maxTicket ? 10 : bet + 1;
    setBet(validateBet);
    if (validateBet + 1 === 11) setErroType("TICKET");
  };
  const reduceBet = () => {
    const validateBet = bet - 1 < 0 ? 0 : bet - 1;
    setBet(validateBet);
    if (validateBet - 1 === -1) setErroType("NFT");
  };

  const backHandler = () => {
    setErroType("");
  };

  // Label Text
  const LabelTitle1 = errorType
    ? errorTypeMsg[errorType].title1
    : "PUNKS, IT’S TIME TO BUY YOUR";
  const LabelTitle2 = errorType
    ? errorTypeMsg[errorType].title2
    : "TICKETS FOR THE one & only";
  const LabelSubTitle = errorType
    ? errorTypeMsg[errorType].subTitle
    : "Russian roulette";

  // Build Interaction Views
  const getInteractionView = () => {
    switch (errorType) {
      case "TICKET":
      case "NFT":
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 60,
            }}
          >
            <BuyToripunksButton />
            <TouchableOpacity onPress={backHandler}>
              <ButtonLabel
                text="BACK"
                size={buttonSize}
                actionable
                style={{ marginLeft: 20 }}
              />
            </TouchableOpacity>
          </View>
        );
      case "TRANSACTION":
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={backHandler}>
              <ButtonLabel text="BACK" size={buttonSize} actionable />
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View>
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ButtonLabel text={userInteractionInfo} size={buttonSize} />
                <BuyToripunksButton />
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
    }
  };

  return (
    <View style={{ marginTop: isMinimunWindowWidth ? 70 : 40 }}>
      {/* Label View */}
      <View>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          {!result ? LabelTitle1 : " "}
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          {!result ? LabelTitle2 : "Punks, you Played"}
        </Label>
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            transform: [{ rotate: "-1.69deg" }],
          }}
        >
          {result ? LabelSubTitle : "Here are your results"}
        </Label>
      </View>
      {/* Interaction View */}
      {getInteractionView()}
    </View>
  );
};

const useToripunks = () => {
  const { selectedWallet } = useContentContext();

  const { nfts } = useNFTs({
    offset: 0,
    limit: 100,
    ownerId: selectedWallet?.userId || "",
    collectionId:
      selectedWallet?.networkId === "teritori-testnet"
        ? "testori-tori10z8um7u47e24rv68ghd43tspeztmqy3cc283gvc3pj48zxs5ljdqn84deq"
        : "tori-tori1plr28ztj64a47a32lw7tdae8vluzm2lm7nqk364r4ws50rgwyzgsapzezt",
    sort: Sort.SORTING_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
  });
  return nfts.length;
};
