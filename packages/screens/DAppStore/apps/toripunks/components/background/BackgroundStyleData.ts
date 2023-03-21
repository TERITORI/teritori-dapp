import disconnect from "../../assets/background/disconnect.png";
import main from "../../assets/background/main.png";
import price from "../../assets/background/price.png";
import pricePool from "../../assets/background/pricePool.png";
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
  price: {
    src: price,
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
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "cover",
  },
  comicbook: {
    src: pricePool,
    style: { ...baseStyle },
    imgStyle: {},
    resizeMode: "cover",
  },
};
