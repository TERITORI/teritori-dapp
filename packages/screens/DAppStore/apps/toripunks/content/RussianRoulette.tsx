import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ActionButton } from "../components/action-button/ActionButton";
import { Button } from "../components/button/Button";
import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { BuyToripunksButton } from "../components/buttonLabel/BuyToripunksButton";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";
import {
  sendKeplarTx,
  useBuyTicket,
  useLastReward,
  useList,
  useProof,
} from "../query/useToriData";

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
  const { isMinimunWindowWidth, setLoadingGame, selectedWallet } =
    useContentContext();
  const [bet, setBet] = useState<number>(0);
  const [errorType, setErroType] = useState<
    "TICKET" | "NFT" | "TRANSACTION" | ""
  >("");
  const [totalToriUser, setTotalToriUser] = useState<number>(0);
  const userTx = useRef<string>("");
  const [winning, setWinning] = useState<number>(0);
  const [losing, setLosing] = useState<number>(0);
  const [remaningTicket, setRemaningTicket] = useState<number>(0);

  const {
    data: userToriPunksList,
    refetch: handleGetToriList,
    error,
  } = useList({
    selectedWallet,
  });

  const { data: lastRewards, refetch: handleGetLasRewards } = useLastReward();

  const { data: buyTSC, mutate: handleBuyTicket } = useBuyTicket({
    userTokens: [...(userToriPunksList as number[])],
    buyCount: bet,
    selectedWallet,
  });

  const { data: ResultData, mutate: handleProofTransc } = useProof({
    tx: userTx.current,
    selectedWallet,
  });

  useEffect(() => {
    handleGetToriList && handleGetToriList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  const getUserToripunks = () => {
    if (Array.isArray(userToriPunksList))
      setTotalToriUser(userToriPunksList.length);
    return 0;
  };

  useEffect(() => {
    getUserToripunks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToriPunksList]);

  useEffect(() => {
    handleGetLasRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      switch (error) {
        case 10:
          setErroType("TICKET");
          break;
        case 20:
          setErroType("NFT");
          break;
        default:
          setErroType("TRANSACTION");
          break;
      }
    }
  }, [error]);

  const styleTypeSize = isMinimunWindowWidth ? "80" : "30";
  const buttonSize = isMinimunWindowWidth ? "S" : "Mobile";

  // replace with user data.
  const userToripunks = totalToriUser;
  const maxTicket = "10";
  const priceTicket = "1";
  const monthPriceTicket = lastRewards;
  const remainingUserTicket = remaningTicket;
  const remainingUserCurrency = totalToriUser;

  // Button text
  const longButtonLabelText = result
    ? `${remainingUserTicket} remaining tickets in the russian roulette`
    : `Last month's winnings per ticket = ${monthPriceTicket}$ TORI`;
  const userInteractionInfo = result
    ? `You can still buy ${remainingUserCurrency} tickets`
    : `${userToripunks} Toripunks in your wallet`;

  const reArrangeTicketList = (tickets: { ticket_id: string }[]) => {
    return tickets.map((ticket: { ticket_id: string }) => ticket.ticket_id);
  };

  const updateToriList = () => {
    if (totalToriUser - bet <= 0) {
      setTotalToriUser(0);
    } else handleGetToriList && handleGetToriList();
    // getUserToripunks();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (buyTSC) {
      const tickets =
        bet === 1
          ? ([buyTSC.ticket.ticket_id] as string[])
          : reArrangeTicketList(buyTSC.created_tickets.tickets);
      // eslint-disable-next-line no-unused-expressions
      bet === 1
        ? setRemaningTicket(buyTSC.remaining_tickets)
        : setRemaningTicket(buyTSC.created_tickets.remaining_tickets);

      handleProofTransc({ tickets });

      updateToriList();
      // eslint-disable-next-line no-unused-expressions
      setLoadingGame(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyTSC]);

  useEffect(() => {
    if (ResultData) {
      setWinning(ResultData.length);
      setLosing(bet - ResultData.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ResultData]);

  // use Hooks to buy, play, add bet , remove bet
  const click = async () => {
    if (result) {
      setBet(0);
      return setResult(!result);
    }
    if (!bet) return;
    setLoadingGame(true);
    sendKeplarTx({ selectedWallet, amount: `${bet * 1000000}` }).then((res) => {
      if (!res) {
        setLoadingGame(false);
        return;
      }
      userTx.current = res ? res.transactionHash : "";
      handleBuyTicket();
      setResult(!result);
    });
  };

  const addBet = () => {
    const validateBet = bet + 1 > +maxTicket ? 10 : bet + 1;
    if (totalToriUser === 0) return setErroType("TICKET");
    if (validateBet <= totalToriUser) setBet(validateBet);
  };
  const reduceBet = () => {
    const validateBet = bet - 1 < 0 ? 0 : bet - 1;
    setBet(validateBet);
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
            <BuyToripunksButton size={buttonSize} />
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
                <BuyToripunksButton size={buttonSize} />
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
    <View>
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
          {!result ? LabelSubTitle : "Here are your results"}
        </Label>
      </View>
      {/* Interaction View */}
      {getInteractionView()}
    </View>
  );
};
