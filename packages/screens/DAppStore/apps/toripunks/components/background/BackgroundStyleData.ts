// @ts-ignore
import comicBookHistory from "../../assets/background/comicbook-history.jpg";
// @ts-ignore
import comicBookLanding from "../../assets/background/comicbook.jpg";
import disconnect from "../../assets/background/disconnect.png";
import lottery from "../../assets/background/lottery.png";
import lotteryHistory from "../../assets/background/lottery_history.png";
import main from "../../assets/background/main.png";
import score from "../../assets/background/score.png";
import welcome from "../../assets/background/welcome.png";
import winorlose from "../../assets/background/winorlose.png";

const baseStyle = { flex: 1 };

export const imgComponent = {
  disconnect: {
    src: disconnect,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "cover",
  },
  roulette: {
    src: main,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "stretch",
  },
  welcome: {
    src: welcome,
    style: { ...baseStyle },
    imgStyle: { filter: "sepia(1) brightness(0.5)" },
    resizeMode: "cover",
  },
  lottery: {
    src: lottery,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "cover",
  },
  score: {
    src: score,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "cover",
  },
  winorlose: {
    src: winorlose,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "cover",
  },
  raffle: {
    src: "",
    style: { ...baseStyle, ...{ backgroundColor: "#1B0D11" } },
    imgStyle: {},
    resizeMode: "cover",
  },
  comicbook: {
    src: comicBookLanding,
    style: { ...baseStyle },
    imgStyle: {
      // filter: "brightness(0.8)",
    },
    resizeMode: "cover",
  },
  "comic-book-history": {
    src: comicBookHistory,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "stretch",
  },
  "lottery-history": {
    src: lotteryHistory,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "stretch",
  },
  "menu-mobile": {
    src: disconnect,
    style: { ...baseStyle },
    imgStyle: { filter: "brightness(0.5)" },
    resizeMode: "cover",
  },
};
