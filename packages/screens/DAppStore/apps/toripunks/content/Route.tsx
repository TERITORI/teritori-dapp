import { ComicBookHistory } from "./ComicBookHistory";
import { ComicBooks } from "./ComicBooks";
import { Disconnect } from "./Disconnect";
import { Lottery } from "./Lottery";
import { LotteryHistory } from "./LotteryHistory";
import { MenuMobile } from "./MenuMobile";
import { MyHistory } from "./MyHistory";
import { Raffle } from "./Raffle";
import { Russian } from "./RussianRoulette";
import { Welcome } from "./Welcome";

export const Route: React.FC<string> = (section: string) => {
  const sectionList = {
    welcome: () => <Welcome />,
    lottery: () => <Lottery />,
    "lottery-history": () => <LotteryHistory />,
    roulette: () => <Russian />,
    raffle: () => <Raffle />,
    comicbook: () => <ComicBooks />,
    disconnect: () => <Disconnect />,
    "my-history": () => <MyHistory />,
    "menu-mobile": () => <MenuMobile />,
    "comic-book-history": () => <ComicBookHistory />,
  };

  const validateCustomRoute = {
    get: (target: any, name: string) => {
      return target.hasOwnProperty(name) ? target[name] : null;
    },
  };

  const validateSection = new Proxy(sectionList, validateCustomRoute);

  const selectedSection = (validateSection as any)[section];

  return selectedSection();
};
